To keep things easier i have http://localhost:8000 hardcoded in App.jsx fetch calls, and http://localhost:5173 hardcoded in FastAPI CORS middleware.
later we when we deply we will hide all that from github as env var
to run backend open terminal with directory sih/api command for powershell is uvicorn main:app --reload

to run the frontend directory sih/frontend command for powershell after directory is set to follwoing npm run dev
