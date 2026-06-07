import { useNavigate, Link } from "react-router-dom";
import { Button, Avatar, Divider, Alert } from "@mantine/core";
import { useAuth } from "../context/useAuth";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
        <Alert color="blue" title="Not logged in">
          <Link to="/login">Sign in</Link> to view your profile.
        </Alert>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user.email[0].toUpperCase();

  return (
    <div style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <Avatar size="lg" radius="xl" color="indigo">
          {initials}
        </Avatar>
        <div>
          <h1 style={{ margin: 0 }}>{user.name ?? "Inkspire User"}</h1>
          <p style={{ margin: 0, color: "#888" }}>{user.email}</p>
        </div>
      </div>

      <Divider my="md" />

      <Button
        fullWidth
        variant="light"
        color="indigo"
        component={Link}
        to="/orders"
        mb="sm"
      >
        My Orders
      </Button>

      <Button
        fullWidth
        variant="outline"
        color="red"
        onClick={() => {
          void handleLogout();
        }}
      >
        Log out
      </Button>
    </div>
  );
}

export default Profile;
