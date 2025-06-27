import cv2
import numpy as np
import pandas as pd
import pytesseract
import re
import matplotlib.pyplot as plt
import ssl
import socket
import whois
import tldextract
import idna

from pyzbar.pyzbar import decode
from PIL import Image
from urllib.parse import urlparse, parse_qs
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from datetime import datetime, timezone

def check_ssl_cert(url):
    try:
        parsed_url = urlparse(url)
        host = parsed_url.hostname
        port = 443
        context = ssl.create_default_context()

        with socket.create_connection((host, port), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=host) as ssock:
                cert_der = ssock.getpeercert(binary_form=True)
                cert = x509.load_der_x509_certificate(cert_der, default_backend())

                ssl_valid = 1
                ssl_self_signed = 1 if cert.issuer == cert.subject else 0

                # Fixed datetime comparison
                now = datetime.now(timezone.utc)
                validity = cert.not_valid_after_utc - datetime.now(timezone.utc)
                ssl_days_left = validity.days if validity.days > 0 else 0

                return ssl_valid, ssl_self_signed, ssl_days_left
    except Exception as e:
        return 0, 0, 0

def get_whois_features(domain):
    features = {
        'domain_age_days': -1,
        'domain_expiry_days': -1,
        'domain_registered': 0,
        'domain_country': '',
        'has_whois_info': 0,
        'registrar': '',
        'name_servers_count': 0
    }

    try:
        info = whois.whois(domain)
        features['has_whois_info'] = 1

        # Handle dates
        creation_date = info.creation_date
        expiration_date = info.expiration_date

        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        if isinstance(expiration_date, list):
            expiration_date = expiration_date[0]

        if creation_date and isinstance(creation_date, datetime):
            features['domain_age_days'] = (datetime.utcnow() - creation_date).days
        if expiration_date and isinstance(expiration_date, datetime):
            features['domain_expiry_days'] = (expiration_date - datetime.utcnow()).days

        # Additional WHOIS features
        features['domain_registered'] = 1 if creation_date else 0
        features['registrar'] = info.registrar if info.registrar else ''
        features['name_servers_count'] = len(info.name_servers) if info.name_servers else 0
        features['domain_country'] = info.country if info.country else ''

    except Exception:
        pass

    return features

def get_tld_features(domain):
    extracted = tldextract.extract(domain)
    return {
        'subdomain_count': len(extracted.subdomain.split('.')),
        'tld': extracted.suffix,
        'domain_part_count': len(extracted.subdomain.split('.')) + 2  # subdomain + domain + suffix
    }

def is_shortener(url):
    shorteners = {'bit.ly', 'goo.gl', 'tinyurl.com', 'ow.ly', 't.co', 'is.gd'}
    return 1 if any(s in url for s in shorteners) else 0

def entropy(s):
    p, lns = np.unique(list(s), return_counts=True)
    return -np.sum((lns/lns.sum()) * np.log2(lns/lns.sum()))

def extract_url_features(URL):
    features = {}

    # Basic URL features
    features['URL_length'] = len(URL)
    features['num_dots'] = URL.count('.')
    features['num_hyphens'] = URL.count('-')
    features['num_slashes'] = URL.count('/')
    features['num_question_marks'] = URL.count('?')
    features['num_equals'] = URL.count('=')
    features['num_at'] = URL.count('@')
    features['has_ip'] = 1 if re.match(r"^(https?:\/\/)?(\d{1,3}\.){3}\d{1,3}", URL) else 0

    # Parsed components
    parsed = urlparse(URL)
    domain = parsed.netloc
    path = parsed.path
    query = parsed.query

    # Domain analysis
    features['domain_length'] = len(domain)
    tld_features = get_tld_features(domain)
    features.update(tld_features)
    features['is_idn'] = 1 if 'xn--' in domain else 0  # Internationalized domain name

    # Path analysis
    features['path_length'] = len(path)
    features['path_depth'] = path.count('/')
    features['file_extension'] = 1 if '.' in path.split('/')[-1] else 0

    # Query parameters analysis
    params = parse_qs(query)
    features['num_parameters'] = len(params)
    sensitive_params = {'password', 'login', 'user', 'creditcard'}
    features['sensitive_params'] = sum(1 for p in params if p.lower() in sensitive_params)

    # Security features
    features['uses_https'] = 1 if parsed.scheme == 'https' else 0
    ssl_valid, ssl_self_signed, ssl_days_left = check_ssl_cert(URL)
    features.update({
        'ssl_cert_valid': ssl_valid,
        'ssl_self_signed': ssl_self_signed,
        'ssl_days_left': ssl_days_left
    })

    # Content features
    features['entropy'] = entropy(URL)
    features['is_shortened'] = is_shortener(URL)
    suspicious_keywords = ['login', 'verify', 'secure', 'account', 'update',
                         'bank', 'paypal', 'signin', 'confirm', 'password']
    features['suspicious_keywords'] = sum(1 for word in suspicious_keywords if word in URL.lower())

    # WHOIS features
    whois_data = get_whois_features(domain)
    features.update(whois_data)

    # Additional features
    features['non_standard_port'] = 1 if parsed.port not in [None, 80, 443] else 0
    features['hex_chars'] = len(re.findall(r'%[0-9a-fA-F]{2}', URL))
    features['redirects'] = len(re.findall('//', URL)) - 1

    # IP and network features
    try:
        ip = socket.gethostbyname(domain)
        features['ip_private'] = 1 if ip.startswith(('10.', '172.', '192.168.')) else 0
    except:
        features['ip_private'] = 0

    return features



def extract_clean_url(qr_data):

    if pd.isna(qr_data) or not isinstance(qr_data, str):
        return None

    url_match = re.search(r'(https?://\S+)', qr_data)

    if url_match:
        url = url_match.group(1)

        url = url.split(' ')[0]
        url = url.split('\n')[0]
        url = url.strip()

        if '...' in url:
            url = url.replace('...', '')

        return url

    return None