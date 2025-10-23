import { useNavigate } from "react-router-dom";

const ReturnHome: React.FC = () => {
    const navigate = useNavigate();

    const handleReturnHome = () => {
        navigate("/");
    };

    return (
        <button onClick={handleReturnHome}>
            Return Home
        </button>
    );
}

export default ReturnHome;