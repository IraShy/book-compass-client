import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PageNotFound from "./components/404";
import Register from "./pages/Register";
import { UserProvider } from "./contexts/UserProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import BookPage from "./pages/BookPage";

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/books/:id" element={<BookPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </main>
      </Router>
    </UserProvider>
  );
}

export default App;
