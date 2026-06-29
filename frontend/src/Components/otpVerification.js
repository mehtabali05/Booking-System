import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header"; // ✅ adjust path if Header is elsewhere
import "./OtpVerification.css"; // optional for styling

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isResending, setIsResending] = useState(false);

    const email = location.state?.email; // email passed from signup
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef([]);

    // ✅ Handle OTP input
    const handleChange = (value, index) => {
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move focus to next input
            if (value && index < 3) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    // ✅ Handle backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // ✅ Verify OTP function
    // const handleVerifyOtp = async (e) => {
    //     e.preventDefault();
    //     const enteredOtp = otp.join("");

    //     if (enteredOtp.length !== 4) {
    //         alert("Please enter the complete 4-digit OTP");
    //         return;
    //     }

    //     try {
    //         const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 email: email,
    //                 otp: Number(enteredOtp),
    //             }),
    //         });

    //         const data = await response.json();

    //         if (response.ok) {
    //             alert("✅ OTP Verified Successfully!");
    //             console.log(data?.user?.role);
    //             // ✅ Navigate based on role
    //             if (data?.user?.role === "parent") navigate("/parent-dashboard");
    //             else if (data?.user?.role === "caretaker") navigate("/caretakerdashboard");
    //             else navigate("/");

    //         } else {
    //             alert(data.message || "Invalid OTP, please try again");
    //         }
    //     } catch (error) {
    //         console.error("Error verifying OTP:", error);
    //         alert("Something went wrong. Please try again later.");
    //     }
    // };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join(""); // Keep as string
    
        if (enteredOtp.length !== 4) {
            alert("Please enter the complete 4-digit OTP");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    otp: enteredOtp, // REMOVED Number() wrapper here
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("✅ OTP Verified Successfully!");
                // Check your role naming matches exactly what's in your DB
                if (data?.user?.role === "parent") navigate("/parent-dashboard");
                else if (data?.user?.role === "caretaker") navigate("/caretakerdashboard");
                else navigate("/");
            } else {
                alert(data.message || "Invalid OTP, please try again");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    const resendOtp = async (e) => {
        e.preventDefault();
        setIsResending(true);

        try {
            const response = await fetch(`http://localhost:5000/api/auth/resend/${email}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: location.state?.email }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("✅ OTP resent successfully! Check your email.");
            } else {
                alert(data.message || "❌ Failed to resend OTP");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Try again.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="otp-verification-page">
            <Header />

            <div className="otp-container">
                <h2>Verify Your Email</h2>
                <p>Enter the 4-digit code sent to <b>{email}</b></p>

                <form onSubmit={handleVerifyOtp}>
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                ref={(el) => (inputRefs.current[index] = el)}
                                className="otp-box"
                            />
                        ))}
                    </div>
                    <div className="resend-otp">
                        <a
                            onClick={resendOtp}
                            className={`resend-link ${isResending ? "disabled" : ""}`}
                            href="#"
                        >
                            {isResending ? "Resending..." : "Resend OTP?"}
                        </a>
                    </div>
                    <button type="submit" className="verify-btn">
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;
