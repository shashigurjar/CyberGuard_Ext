from mongoengine import Document, StringField, EmailField

class User(Document):
    name = StringField(required = True, min_length=2)
    email = EmailField(required = True, unique = True)
    password = StringField(required = True, min_length=5)

    def __str__(self):
        return f"User(name={self.name}, email={self.email})"