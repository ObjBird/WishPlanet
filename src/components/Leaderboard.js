import React from 'react';
import { Heart, Gift, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// 现代化白色主题排行榜组件
function Leaderboard({ wishes = [], timeframe = 'all', setTimeframe }) {
    const sortedWishes = React.useMemo(() => {
        const now = Date.now();
        let filteredWishes = [...wishes];

        // 根据时间范围过滤
        switch (timeframe) {
            case 'week':
                filteredWishes = wishes.filter(w => {
                    const timestamp = w.timestamp || w.createdAt || now;
                    return now - timestamp <= 7 * 24 * 60 * 60 * 1000;
                });
                break;
            case 'month':
                filteredWishes = wishes.filter(w => {
                    const timestamp = w.timestamp || w.createdAt || now;
                    return now - timestamp <= 30 * 24 * 60 * 60 * 1000;
                });
                break;
            case 'year':
                filteredWishes = wishes.filter(w => {
                    const timestamp = w.timestamp || w.createdAt || now;
                    return now - timestamp <= 365 * 24 * 60 * 60 * 1000;
                });
                break;
            default:
                break;
        }

        // 按点赞数 + 打赏金额排序
        return filteredWishes
            .sort((a, b) => {
                const scoreA = (a.likes || 0) + (a.donations || a.totalRewards || 0);
                const scoreB = (b.likes || 0) + (b.donations || b.totalRewards || 0);
                return scoreB - scoreA;
            })
            .slice(0, 10);
    }, [wishes, timeframe]);

    const timeframeOptions = [
        { key: 'all', label: '全部', icon: Trophy },
        { key: 'week', label: '周榜', icon: Calendar },
        { key: 'month', label: '月榜', icon: TrendingUp }
    ];

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return '🥇';
            case 1: return '🥈';
            case 2: return '🥉';
            default: return `${index + 1}`;
        }
    };

    const getRankColor = (index) => {
        switch (index) {
            case 0: return 'from-yellow-400 to-yellow-600';
            case 1: return 'from-gray-300 to-gray-500';
            case 2: return 'from-orange-400 to-orange-600';
            default: return 'from-blue-400 to-blue-600';
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-4 shadow-lg">
            {/* 标题 */}
            <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <h2 className="text-lg font-bold text-gray-800">排行榜</h2>
                </div>
                <p className="text-gray-600 text-sm">
                    最受欢迎的心愿 Top 10
                </p>
            </div>

            {/* 时间范围选择 */}
            <div className="flex justify-center gap-2 mb-4">
                {timeframeOptions.map(({ key, label, icon: Icon }) => (
                    <motion.button
                        key={key}
                        onClick={() => setTimeframe && setTimeframe(key)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                            timeframe === key
                                ? 'bg-blue-100 text-blue-600 border border-blue-300'
                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Icon className="w-3 h-3" />
                        {label}
                    </motion.button>
                ))}
            </div>

            {/* 排行榜列表 */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {sortedWishes.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-2 opacity-50">🌟</div>
                        <p className="text-gray-500 text-sm">暂无心愿数据</p>
                    </div>
                ) : (
                    sortedWishes.map((wish, index) => (
                        <motion.div
                            key={wish.id || index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm"
                        >
                            <div className="flex items-start gap-3">
                                {/* 排名 */}
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-gradient-to-br ${getRankColor(index)} text-white shadow-sm`}>
                                    {getRankIcon(index)}
                                </div>

                                {/* 内容 */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-gray-800 text-sm mb-2 leading-relaxed overflow-hidden" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {wish.wishContent || wish.content || '未知心愿'}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        {/* 作者 */}
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-xs">👤</span>
                                            </div>
                                            <span className="text-gray-600 text-xs truncate max-w-16">
                                                {wish.nickname || wish.author || '匿名'}
                                            </span>
                                        </div>

                                        {/* 统计数据 */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-3 h-3 text-pink-500" />
                                                <span className="text-xs font-medium text-gray-700">
                                                    {wish.likes || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Gift className="w-3 h-3 text-yellow-500" />
                                                <span className="text-xs font-medium text-gray-700">
                                                    {wish.donations || wish.totalRewards || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Leaderboard;
