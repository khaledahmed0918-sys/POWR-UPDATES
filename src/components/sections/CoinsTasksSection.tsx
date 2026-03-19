import { useState, useEffect } from 'react';
import { Container } from '../layout/Container';
import { SectionTitle } from '../ui/SectionTitle';
import { GlassCard } from '../ui/GlassCard';
import { Skeleton } from '../ui/Skeleton';
import { Search, ShoppingCart, CheckCircle, Clock, Coins, User } from 'lucide-react';

interface Purchase {
  user_id: string;
  item_name: string;
  price: number;
  date: string;
}

interface StoreItem {
  item_name: string;
  price: number;
  limits: string;
  sold: string[];
  finish: string | null;
  emoji_id: string;
}

interface Task {
  task_name: string;
  reward: number;
  remaining: number;
  finish: string | null;
  completed: string | null;
}

interface UserData {
  data: {
    coins: number;
    tasks_remaining: number;
    tasks_completed: number;
    last_5: Purchase[];
  };
  tasks: Task[];
}

export function CoinsTasksSection() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch recent purchases
    fetch('/api/purchases')
      .then(res => res.json())
      .then(data => setPurchases(data.purchases || []))
      .catch(() => {}); // Ignore errors to keep console clean

    // Fetch store items
    fetch('/api/store')
      .then(res => res.json())
      .then(data => setStoreItems(data.items || []))
      .catch(() => {}); // Ignore errors to keep console clean
  }, []);

  const handleSearchUser = async () => {
    if (!userId.trim()) return;
    setLoadingUser(true);
    setUserError(null);
    try {
      const res = await fetch(`/api/users/${userId.trim()}`);
      if (!res.ok) throw new Error('User not found');
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setUserError('لم يتم العثور على بيانات المستخدم.');
      setUserData(null);
    } finally {
      setLoadingUser(false);
    }
  };

  return (
    <div className="py-20 relative">
      <Container>
        <SectionTitle title="نظام العملات والمهام" subtitle="المتجر، المشتريات، وبطاقة معلوماتي" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* My Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-6 bg-black/40 border-blue-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <User className="text-blue-400" />
                بطاقة معلوماتي
              </h3>
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  placeholder="أدخل ID الخاص بك..."
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="flex-1 bg-black/40 border border-blue-500/20 rounded-xl py-2 px-4 text-white placeholder-blue-400/30 focus:outline-none focus:border-blue-500/50"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
                />
                <button
                  onClick={handleSearchUser}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>

              {loadingUser ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : userError ? (
                <div className="text-red-400 text-center py-4">{userError}</div>
              ) : userData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                      <Coins className="text-yellow-400 mx-auto mb-2" size={24} />
                      <div className="text-2xl font-bold text-white">{userData.data.coins}</div>
                      <div className="text-xs text-gray-400">العملات</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                      <CheckCircle className="text-green-400 mx-auto mb-2" size={24} />
                      <div className="text-2xl font-bold text-white">{userData.data.tasks_completed}</div>
                      <div className="text-xs text-gray-400">المهام المنجزة</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                      <Clock className="text-blue-400 mx-auto mb-2" size={24} />
                      <div className="text-2xl font-bold text-white">{userData.data.tasks_remaining}</div>
                      <div className="text-xs text-gray-400">المهام المتبقية</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3 text-lg">المهام الحالية</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {userData.tasks.filter(t => !t.completed).map((task, idx) => (
                        <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/10">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-sm text-white">{task.task_name}</span>
                            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full flex items-center gap-1">
                              <Coins size={12} /> {task.reward}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>المتبقي: {task.remaining}</span>
                            <span className="text-blue-400">قيد التنفيذ</span>
                          </div>
                        </div>
                      ))}
                      {userData.tasks.filter(t => !t.completed).length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4">لا توجد مهام حالية</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-3 text-lg mt-6">المهام المنجزة</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      {userData.tasks.filter(t => t.completed).map((task, idx) => {
                        const isStreak = task.task_name && (task.task_name.toLowerCase().includes('streak') || task.task_name.includes('ستريك'));
                        return (
                          <div key={idx} className="bg-green-500/5 p-3 rounded-lg border border-green-500/20">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-sm text-green-400">
                                {isStreak ? 'تم إنجاز مهمة الستريك لليوم' : task.task_name}
                              </span>
                              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full flex items-center gap-1">
                                <Coins size={12} /> {task.reward}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                              <span className="text-green-400 flex items-center gap-1">
                                <CheckCircle size={12} /> مكتملة
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {userData.tasks.filter(t => t.completed).length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-4">لا توجد مهام منجزة</div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm py-8">
                  أدخل الـ ID الخاص بك لعرض معلوماتك والمهام
                </div>
              )}
            </GlassCard>
          </div>

          {/* Store and Purchases */}
          <div className="lg:col-span-2 space-y-8">
            {/* Store Items */}
            <GlassCard className="p-6 bg-black/40 border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShoppingCart className="text-purple-400" />
                المتجر
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {storeItems.length > 0 ? (
                  storeItems.map((item, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
                      <div className="text-3xl bg-black/50 w-12 h-12 rounded-full flex items-center justify-center border border-white/10">
                        {item.emoji_id}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">{item.item_name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Coins size={10} /> {item.price}
                          </span>
                          <span className="text-xs text-gray-400">
                            المبيعات: {item.sold.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-8">جاري تحميل المتجر...</div>
                )}
              </div>
            </GlassCard>

            {/* Recent Purchases */}
            <GlassCard className="p-6 bg-black/40 border-green-500/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="text-green-400" />
                آخر 10 مشتريات
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {purchases.length > 0 ? (
                  purchases.slice(0, 10).map((purchase, idx) => (
                    <div key={idx} className="bg-white/5 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm text-white">{purchase.item_name}</div>
                        <div className="text-xs text-gray-400 mt-1 font-mono">ID: {purchase.user_id}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-yellow-400 font-bold flex items-center justify-end gap-1 mb-1">
                          <Coins size={10} /> {purchase.price}
                        </div>
                        <div className="text-[10px] text-gray-500">{purchase.date}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">جاري تحميل المشتريات...</div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </Container>
    </div>
  );
}
