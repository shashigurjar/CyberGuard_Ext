from fastapi import Request, HTTPException, status

async def session_auth_required(request: Request):
    if "user_id" not in request.session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized: Not logged in"
        )
