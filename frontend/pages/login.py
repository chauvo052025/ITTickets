```python
import streamlit as st
import requests
from typing import Dict

def login_user(email: str, password: str) -> Dict:
    """Authenticate user with backend"""
    try:
        response = requests.post(
            "http://localhost:8000/auth/login",
            json={"email": email, "password": password}
        )
        return response.json()
    except requests.RequestException as e:
        st.error(f"Connection error: {str(e)}")
        return None

def show():
    st.title("Welcome to School IT Support")
    
    with st.container():
        col1, col2, col3 = st.columns([1, 2, 1])
        
        with col2:
            st.subheader("Login")
            with st.form("login_form"):
                email = st.text_input("Email")
                password = st.text_input("Password", type="password")
                submit = st.form_submit_button("Login")
                
                if submit:
                    if email and password:
                        result = login_user(email, password)
                        if result and "access_token" in result:
                            st.session_state.authenticated = True
                            st.session_state.user = result["user"]
                            st.rerun()
                        else:
                            st.error("Invalid email or password")
                    else:
                        st.warning("Please enter both email and password")
            
            st.divider()
            st.markdown("""
            **Demo Accounts:**
            - Teacher: `teacher@school.com` / `password`
            - IT Staff: `it@school.com` / `password`
            - Admin: `admin@school.com` / `password`
            """)
```