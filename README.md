# School IT Support System

A user-friendly IT support ticketing system designed specifically for primary schools, built with Python, FastAPI, and Streamlit.

## Features

- Simple and intuitive interface for teachers and staff
- Ticket creation and tracking
- Priority-based support queue
- IT staff assignment and management
- Real-time status updates
- Knowledge base for common issues

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/school-it-support.git
   cd school-it-support
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file with:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-anon-key
   ```

5. Run the application:
   ```bash
   # Start backend API
   uvicorn api.main:app --reload

   # In another terminal, start frontend
   streamlit run frontend/main.py
   ```

## Usage

### For Teachers

1. Log in with your school email
2. Create a new support ticket:
   - Provide a clear title and description
   - Select priority level
   - Add any relevant details
3. Track ticket status and respond to IT staff questions
4. View knowledge base for self-help

### For IT Staff

1. Log in with IT staff credentials
2. View and manage support queue
3. Assign and update tickets
4. Add internal notes and solutions
5. Update knowledge base

### For Administrators

1. Access complete system overview
2. Manage staff accounts
3. View reports and analytics
4. Configure system settings

## Architecture

The application follows a clean, modular architecture:

```
school-it-support/
├── api/                 # Backend FastAPI application
│   ├── main.py         # Main API entry point
│   ├── models.py       # Data models
│   ├── database.py     # Database connection
│   └── routers/        # API endpoints
├── frontend/           # Streamlit frontend
│   ├── main.py        # Main frontend entry point
│   ├── pages/         # Application pages
│   └── components/    # Reusable UI components
├── tests/             # Test suite
└── docs/              # Documentation
```

## Database Schema

See `supabase/migrations/create_initial_schema.sql` for complete database structure.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details