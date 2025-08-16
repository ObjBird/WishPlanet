import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Wallet, LogOut } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';

const Layout = ({ onAddWish }) => {
  const location = useLocation();
  const [particles, setParticles] = useState([]);
  const { account, isConnecting, isConnected, connectWallet, disconnectWallet } = useWeb3();

  // Generate background particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 20,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  // 处理钱包连接
  const handleWalletConnect = async () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      await connectWallet();
    }
  };

  // 格式化账户地址显示
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="layout">
      {/* Animated background particles */}
      <div className="particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="nav">
        <motion.div
          className="nav-container"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* 添加心愿按钮 */}
          <motion.button
            onClick={onAddWish}
            className="add-wish-btn relative flex items-center gap-3 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-yellow-100 border border-yellow-400/30 hover:border-yellow-400/50 shadow-lg hover:shadow-yellow-400/20 font-medium rounded-xl transition-all duration-300 backdrop-blur-sm overflow-hidden group hover:scale-105"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px -10px rgba(251, 191, 36, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 微妙的背景渐变 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* 图标和文字 */}
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <Plus size={16} />
            </motion.div>
            <span className="relative z-10 text-sm font-medium text-white">添加心愿</span>

            {/* 微妙的装饰指示器 */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-sm"></div>
          </motion.button>

          <Link to="/" className="logo">
            <span className="logo-text gradient-text-primary">心愿星球</span>
          </Link>

          {/* 钱包连接按钮 */}
          <motion.button
            onClick={handleWalletConnect}
            disabled={isConnecting}
            className={`wallet-btn relative flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 font-medium backdrop-blur-sm overflow-hidden group ${isConnected
              ? 'bg-white/10 hover:bg-white/20 text-green-100 border border-green-400/30 hover:border-green-400/50 shadow-lg hover:shadow-green-400/20'
              : 'bg-white/10 hover:bg-white/20 text-blue-100 border border-blue-400/30 hover:border-blue-400/50 shadow-lg hover:shadow-blue-400/20'
              } ${isConnecting ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'}`}
            whileHover={{
              scale: isConnecting ? 1 : 1.05,
              boxShadow: isConnected
                ? "0 10px 30px -10px rgba(34, 197, 94, 0.3)"
                : "0 10px 30px -10px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: isConnecting ? 1 : 0.98 }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* 微妙的背景渐变 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white"></div>

            {isConnecting ? (
              <>
                <div className="relative z-10 w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin "></div>
                <span className="relative z-10 text-sm font-medium text-white">连接中...</span>
              </>
            ) : isConnected ? (
              <>
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <LogOut size={16} />
                </motion.div>
                <div className="relative z-10 flex flex-col items-start">
                  <span className="text-sm font-medium text-white">{formatAddress(account)}</span>
                  {/* <span className="text-xs text-green-300/80">已连接</span> */}
                </div>
                {/* 连接状态指示器 */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <Wallet size={16} />
                </motion.div>
                <span className="relative z-10 text-sm font-medium text-white">连接钱包</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>

      <style jsx>{`
        .layout {
          min-height: 100vh;
          position: relative;
        }

        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: transparent;
          backdrop-filter: none;
          border-bottom: none;
          box-shadow: none;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 24px;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .wallet-btn {
          min-width: 120px;
          min-height: 40px;
        }
        
        .add-wish-btn {
          min-width: 120px;
          min-height: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: white;
        }

        .logo-text {
          font-size: 32px;
          font-weight: 700;
          font-family: 'JetBrains Mono', monospace;
          text-align: center;
        }





        .main-content {
          padding-top: 0px;
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 0 16px;
          }

          .logo-text {
            font-size: 20px;
          }


        }
      `}</style>
    </div>
  );
};

export default Layout; 