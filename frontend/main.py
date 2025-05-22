```python
import streamlit as st
from pages import login, dashboard, tickets, knowledge_base
import os
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(
    page_title="School IT Support",
    page_icon="🏫",
    layout="wide"
)

# Initialize session state
if "authenticated" not in st.session_state:
    st.session_state.authenticated = False
if "user" not in st.session_state:
    st.session_state.user = None

def main():
    # Sidebar navigation
    if st.session_state.authenticated:
        with st.sidebar:
            st.title("Navigation")
            page = st.radio(
                "Go to",
                ["Dashboard", "Tickets", "Knowledge Base"]
            )
            
            st.divider()
            if st.button("Logout"):
                st.session_state.authenticated = False
                st.session_state.user = None
                st.rerun()
        
        # Main content
        if page == "Dashboard":
            dashboard.show()
        elif page == "Tickets":
            tickets.show()
        elif page == "Knowledge Base":
            knowledge_base.show()
    else:
        login.show()

if __name__ == "__main__":
    main()
```