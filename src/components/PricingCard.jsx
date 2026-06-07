export default function PricingCard({ title, price, users, onSelect }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "20px",
      borderRadius: "10px",
      width: "250px",
      textAlign: "center"
    }}>
      <h2>{title}</h2>
      <h3>${price}/month</h3>
      <p>{users} Users</p>

      <button
        onClick={onSelect}
        style={{
          padding: "10px 15px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Select Plan
      </button>
    </div>
  );
}