import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeScene from '../components/ThreeScene';
import ContentModal from '../components/ContentModal';
import SignModal from '../components/SignModal';
import AddWishModal from '../components/AddWishModal';
import Leaderboard from '../components/Leaderboard';

import { useWeb3 } from '../context/Web3Context';
import toast from 'react-hot-toast';

// 心愿星球页面 - 带指示牌和内容创建功能
function WishPlanetPage({ showAddWishModal, onCloseAddWish, showLeaderboard }) {
    const { getAllWishes, createWish, isConnected, connectWallet } = useWeb3();
    const [showSignModal, setShowSignModal] = useState(false);
    const [showContentModal, setShowContentModal] = useState(false);
    const [selectedSignId, setSelectedSignId] = useState(null);
    const [contractWishes, setContractWishes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [leaderboardTimeframe, setLeaderboardTimeframe] = useState('all');

    // 加载合约心愿数据
    const loadContractWishes = async () => {
        if (!isConnected) {
            console.log("钱包未连接，跳过加载合约数据");
            return;
        }

        setIsLoading(true);
        try {
            console.log("开始加载合约心愿数据...");
            const wishes = await getAllWishes();
            console.log("从合约获取的心愿:", wishes);
            setContractWishes(wishes);
            if (wishes.length > 0) {
                toast.success(`成功加载 ${wishes.length} 个链上心愿`);
            } else {
                toast.info("暂无链上心愿数据");
            }
        } catch (error) {
            console.error("加载合约心愿失败:", error);
            toast.error("加载心愿数据失败");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // 如果已连接钱包，立即加载合约数据
        if (isConnected) {
            loadContractWishes();
        } else {
            // 未连接钱包时清空数据
            setContractWishes([]);
        }
    }, [isConnected]);

    // 只显示合约数据
    const allWishes = contractWishes;

    // 处理指示牌点击 - 显示该牌子的心愿列表
    const handleSignClick = (signId) => {
        console.log('WishPlanetPage: 收到点击信号', signId); // 调试信息
        setSelectedSignId(signId);
        setShowSignModal(true);
    };

    // 处理创建新心愿
    const handleCreateWish = (signId) => {
        setSelectedSignId(signId);
        setShowContentModal(true);
    };

    // 关闭指示牌弹窗
    const handleCloseSignModal = () => {
        setShowSignModal(false);
        setSelectedSignId(null);
    };

    // 关闭内容创建弹窗
    const handleCloseContentModal = () => {
        setShowContentModal(false);
        setSelectedSignId(null);
    };

    // 保存心愿后的回调 - 现在心愿通过合约创建
    const handleWishSaved = async (wishData) => {
        if (!isConnected) {
            toast.error("请先连接钱包");
            return;
        }

        try {
            console.log('正在上链创建心愿:', wishData);
            const txHash = await createWish(wishData.wishContent, wishData.nickname || "匿名用户");
            if (txHash) {
                toast.success("心愿已成功上链！");
                // 刷新心愿数据
                await loadContractWishes();
            }
        } catch (error) {
            console.error('创建心愿失败:', error);
            toast.error('创建心愿失败，请重试');
        }
    };

    // 心愿更新回调（用于点赞、打赏后刷新数据）
    const handleWishUpdate = async () => {
        // 如果连接了钱包，刷新合约数据
        if (isConnected) {
            await loadContractWishes();
        }
    };

    // 关闭添加心愿弹窗
    const handleCloseAddWishModal = () => {
        if (onCloseAddWish) {
            onCloseAddWish();
        }
    };

    // 保存新心愿 - 通过合约创建
    const handleSaveNewWish = async (wishData) => {
        if (!isConnected) {
            toast.error("请先连接钱包");
            return;
        }

        try {
            console.log('正在上链创建新心愿:', wishData);
            const txHash = await createWish(wishData.wishContent, wishData.nickname || "匿名用户");
            if (txHash) {
                toast.success("心愿已成功上链！");
                // 刷新心愿数据
                await loadContractWishes();
            }
        } catch (error) {
            console.error('创建新心愿失败:', error);
            toast.error('创建心愿失败，请重试');
        }
    };

    return (
        <div className="min-h-screen overflow-hidden relative">
            {/* 加载状态指示器 */}
            {isLoading && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                    正在加载合约数据...
                </div>
            )}

            {/* 连接钱包提示 */}
            {/* {!isConnected && (
                <div className="absolute top-4 left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                    onClick={connectWallet}>
                    连接钱包查看链上心愿
                </div>
            )} */}

            {/* 数据状态指示器 */}
            {isConnected && (
                <div className="absolute top-4 left-4 z-50 bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                    链上心愿: {contractWishes.length} 个
                </div>
            )}


            {/* 主内容区域 */}
            <div className="relative h-screen">
                {/* 3D 场景 - 全屏 */}
                <div className="absolute inset-0">
                    <ThreeScene
                        onSignClick={handleSignClick}
                        wishes={allWishes}
                    />
                </div>
                
                {/* 右侧 - 排行榜 - 悬浮在右上角 */}
                <AnimatePresence>
                    {showLeaderboard && (
                        <motion.div 
                            className="absolute top-4 right-4 z-40 w-80"
                            initial={{ opacity: 0, x: 50, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <Leaderboard 
                                wishes={allWishes}
                                timeframe={leaderboardTimeframe}
                                setTimeframe={setLeaderboardTimeframe}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 指示牌弹窗 - 显示该牌子的心愿列表 */}
            <SignModal
                isOpen={showSignModal}
                onClose={handleCloseSignModal}
                signId={selectedSignId}
                onCreateWish={handleCreateWish}
                savedWishes={allWishes}
                onWishUpdate={handleWishUpdate}
            />

            {/* 内容创建模态框 - 创建新心愿 */}
            <ContentModal
                isOpen={showContentModal}
                onClose={handleCloseContentModal}
                signId={selectedSignId}
                onSave={handleWishSaved}
            />

            {/* 添加心愿弹窗 */}
            <AddWishModal
                isOpen={showAddWishModal}
                onClose={handleCloseAddWishModal}
                onSave={handleSaveNewWish}
            />
        </div>
    );
}

export default WishPlanetPage;
