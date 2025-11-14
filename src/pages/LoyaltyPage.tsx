import React, { useEffect, useState } from "react";
import { getBalance, getHistory, redeemPoints } from "../services/loyaltyService";
import "./loyalty.scss";

interface HistoryItem {
  description: string;
  points: number;
  created_at: string;
}

const LoyaltyPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [redeemValue, setRedeemValue] = useState<number>(0);
  const [discount, setDiscount] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [balanceData, historyData] = await Promise.all([
          getBalance(),
          getHistory(),
        ]);
        setBalance(balanceData.balance);
        setHistory(historyData);
      } catch (err: any) {
        setError(err.message || "Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRedeem = async () => {
    if (redeemValue > balance) {
      alert("No tienes suficientes puntos");
      return;
    }
    try {
      const res = await redeemPoints(redeemValue);
      setDiscount(res.discount || "Canje exitoso");
      setBalance(res.balance);
      setRedeemValue(0);

      const updatedHistory = await getHistory();
      setHistory(updatedHistory);
    } catch (err: any) {
      alert(err.message || "Error al canjear puntos");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="loyalty-page">
      
      {/* --- Balance Card --- */}
      <div className="loyalty-balance-card">
        <h2>Puntos actuales: {balance}</h2>
      </div>

      {/* --- Redeem Section --- */}
      <div className="loyalty-redeem">
        <input
          type="number"
          value={redeemValue}
          onChange={(e) => setRedeemValue(Number(e.target.value))}
          placeholder="Puntos a canjear"
        />
        <button onClick={handleRedeem}>Canjear</button>

        {discount && (
          <p className="discount-message">
            Descuento aplicado: {discount}
          </p>
        )}
      </div>

      {/* --- History Section --- */}
      <div className="loyalty-history">
        <h3>Historial</h3>
        <ul>
          {history.map((item, i) => (
            <li key={i}>
              <span className="item-desc">
                {item.description} ({item.points > 0 ? "+" : ""}{item.points})
              </span>
              <span className="item-date">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoyaltyPage;
