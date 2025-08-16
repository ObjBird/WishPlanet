import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Heart, Gift, Star, Edit, Trash2, Eye } from 'lucide-react';

const SignModal = ({ isOpen, onClose, signId, onCreateWish, savedWishes = [], onWishUpdate }) => {
    const [signWishes, setSignWishes] = useState([]);
    const [selectedWish, setSelectedWish] = useState(null);
    const [showWishDetail, setShowWishDetail] = useState(false);

    // 获取当前指示牌的心愿
    useEffect(() => {
        if (signId && savedWishes.length > 0) {
            // 对于合约数据，显示所有心愿；对于本地数据，过滤特定signId
            const wishes = savedWishes.filter(wish => {
                // 如果心愿有signId属性，说明是本地数据，需要过滤
                if (wish.signId !== undefined) {
                    return wish.signId === signId;
                }
                // 如果没有signId属性，说明是合约数据，显示所有
                return true;
            });
            setSignWishes(wishes);
        } else {
            setSignWishes([]);
        }
    }, [signId, savedWishes]);

    const handleCreateNew = () => {
        onClose();
        onCreateWish(signId);
    };

    const handleViewWish = (wish) => {
        setSelectedWish(wish);
        setShowWishDetail(true);
    };

    const handleDeleteWish = (wishId) => {
        if (window.confirm('确定要删除这个心愿吗？')) {
            const wishStorageService = require('../services/wishStorageService').default;
            if (wishStorageService.deleteWish(wishId)) {
                // 更新本地状态
                setSignWishes(prev => prev.filter(wish => wish.id !== wishId));
                // 通知父组件更新
                if (onWishUpdate) {
                    onWishUpdate();
                }
                console.log('心愿删除成功:', wishId);
            } else {
                alert('删除失败，请重试');
            }
        }
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getWishCategoryEmoji = (category) => {
        const categoryMap = {
            'personal': '🌟',
            'family': '👨‍👩‍👧‍👦',
            'career': '💼',
            'health': '💚',
            'love': '💕',
            'travel': '🌍',
            'other': '✨'
        };
        return categoryMap[category] || '✨';
    };

    const getSignName = (signId) => {
        const signNames = {
            'sign_0': '顶部星台',
            'sign_1': '右侧月台',
            'sign_2': '左侧云台',
            'sign_3': '前方光台',
            'sign_4': '底部梦台'
        };
        return signNames[signId] || '神秘平台';
    };

    // 点赞功能
    const handleLikeWish = (wishId) => {
        const wishStorageService = require('../services/wishStorageService').default;
        const updatedWish = wishStorageService.incrementLikes(wishId);
        if (updatedWish) {
            // 更新本地状态
            setSignWishes(prev => prev.map(wish =>
                wish.id === wishId ? updatedWish : wish
            ));
            setSelectedWish(updatedWish);
            // 通知父组件更新
            if (onWishUpdate) {
                onWishUpdate();
            }
        }
    };

    // 打赏功能
    const handleDonateWish = (wishId) => {
        const amount = prompt('请输入打赏金额 (MON):');
        if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
            const wishStorageService = require('../services/wishStorageService').default;
            const updatedWish = wishStorageService.addDonation(wishId, parseFloat(amount));
            if (updatedWish) {
                // 更新本地状态
                setSignWishes(prev => prev.map(wish =>
                    wish.id === wishId ? updatedWish : wish
                ));
                setSelectedWish(updatedWish);
                // 通知父组件更新
                if (onWishUpdate) {
                    onWishUpdate();
                }
                alert(`打赏成功！感谢您的 ${amount} MON 支持！`);
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] pointer-events-none bg-[#fff]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* 背景遮罩 */}
                    <motion.div
                        className="absolute inset-0 bg-white/70 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ pointerEvents: 'auto' }}
                    />

                    {/* 模态框内容 */}
                    <div className="flex items-center justify-center min-h-screen p-4 pointer-events-auto">
                        <motion.div
                            initial={{ scale: 0.3, opacity: 0, rotateY: -15 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0.3, opacity: 0, rotateY: 15 }}
                            transition={{ duration: 0.5, ease: "easeOut", type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="relative bg-white/90 backdrop-blur-xl border-2 border-gray-200 rounded-3xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">


                                {/* 关闭按钮 */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-3 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-all duration-300 group z-10"
                                >
                                    <X size={20} className="text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
                                </button>

                                {/* 标题 */}
                                <div className="mb-8 text-center">
                                    <div className="relative inline-block">
                                        <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                            🏷️ {getSignName(signId)} 🏷️
                                        </h2>
                                    </div>
                                    <p className="text-gray-600 text-lg font-medium">
                                        这里记录着你的美好心愿和珍贵回忆
                                    </p>
                                    <div className="mt-2 text-gray-500">
                                        心愿总数: {signWishes.length} 个 ✨
                                    </div>
                                </div>

                                {/* 心愿列表 */}
                                <div className="mb-6">
                                    {signWishes.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4 opacity-40">🌟</div>
                                            <h3 className="text-xl font-bold text-gray-600 mb-2">
                                                这里还没有心愿
                                            </h3>
                                            <p className="text-gray-500 mb-6">
                                                点击下方按钮创建你的第一个心愿吧！
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {signWishes.map((wish, index) => (
                                                <motion.div
                                                    key={wish.id || index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-gray-50 rounded-2xl p-5 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg hover:shadow-gray-300/50"
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl">
                                                                {getWishCategoryEmoji(wish.wishCategory || 'other')}
                                                            </span>
                                                            <div>
                                                                <h4 className="font-bold text-gray-800 text-lg line-clamp-1">
                                                                    {wish.wishTitle || wish.content || '未命名心愿'}
                                                                </h4>
                                                                <p className="text-gray-500 text-sm">
                                                                    {formatDate(wish.timestamp || wish.createdAt)}
                                                                </p>
                                                                {/* 显示创建者昵称（仅合约数据） */}
                                                                {wish.nickname && (
                                                                    <p className="text-gray-600 text-xs">
                                                                        👤 {wish.nickname}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleViewWish(wish)}
                                                                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-all duration-200"
                                                                title="查看详情"
                                                            >
                                                                <Eye size={16} className="text-blue-600" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteWish(wish.id)}
                                                                className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-all duration-200"
                                                                title="删除"
                                                            >
                                                                <Trash2 size={16} className="text-red-600" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                                                        {wish.wishContent || wish.content || '心愿内容'}
                                                    </p>

                                                    {wish.feeling && (
                                                        <p className="text-gray-600 text-xs italic bg-gray-100 rounded-lg p-2 mb-3">
                                                            💭 {wish.feeling}
                                                        </p>
                                                    )}

                                                    {/* 合约地址信息（仅合约数据） */}
                                                    {wish.address && (
                                                        <p className="text-blue-600 text-xs bg-blue-50 rounded-lg p-2 mb-3 break-all">
                                                            🔗 {wish.address}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            {wish.address ? '⛓️ 链上心愿' : wish.type === 'wish' ? '💫 本地心愿' : `📁 ${wish.type}`}
                                                        </span>
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-1 text-pink-600">
                                                                <Heart size={14} />
                                                                {wish.likes || 0}
                                                            </span>
                                                            <span className="flex items-center gap-1 text-yellow-600">
                                                                <Gift size={14} />
                                                                {(wish.donations || wish.totalRewards || 0)} MON
                                                            </span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 创建新心愿按钮 */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleCreateNew}
                                        className="px-8 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white rounded-2xl transition-all duration-300 flex items-center gap-3 font-bold text-lg shadow-lg hover:shadow-blue-500/30 border border-blue-300 hover:scale-105"
                                    >
                                        <Plus size={24} />
                                        ✨ 创建新心愿 ✨
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* 心愿详情弹窗 */}
                    <AnimatePresence>
                        {showWishDetail && selectedWish && (
                            <motion.div
                                className="fixed inset-0 z-[10000] pointer-events-auto"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
                                <div className="flex items-center justify-center min-h-screen p-4">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        className="relative bg-white/90 backdrop-blur-xl border-2 border-gray-200 rounded-3xl p-8 w-full max-w-2xl shadow-2xl"
                                    >
                                        <button
                                            onClick={() => setShowWishDetail(false)}
                                            className="absolute top-4 right-4 p-2 rounded-full bg-red-100 hover:bg-red-200 transition-all"
                                        >
                                            <X size={18} className="text-gray-600" />
                                        </button>

                                        <div className="text-center mb-6">
                                            <div className="text-4xl mb-3">
                                                {getWishCategoryEmoji(selectedWish.wishCategory)}
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                                {selectedWish.wishTitle}
                                            </h3>
                                            <p className="text-gray-600">
                                                {formatDate(selectedWish.timestamp)}
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-gray-50 rounded-2xl p-6">
                                                <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    📝 心愿内容
                                                </h4>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {selectedWish.wishContent}
                                                </p>
                                            </div>

                                            {selectedWish.feeling && (
                                                <div className="bg-gray-100 rounded-2xl p-6">
                                                    <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                        💭 心情感想
                                                    </h4>
                                                    <p className="text-gray-600 leading-relaxed italic">
                                                        {selectedWish.feeling}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleLikeWish(selectedWish.id)}
                                                    className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold hover:scale-105"
                                                >
                                                    <Heart size={18} />
                                                    点赞 ({selectedWish.likes || 0})
                                                </button>
                                                <button
                                                    onClick={() => handleDonateWish(selectedWish.id)}
                                                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-bold hover:scale-105"
                                                >
                                                    <Gift size={18} />
                                                    打赏 ({selectedWish.donations || 0})
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SignModal;
