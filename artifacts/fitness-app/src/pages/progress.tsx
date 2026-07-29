import { useGetWeeklyStats, useGetMuscleGroupStats, useGetStatsSummary } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { LineChart as LineChartIcon, Flame, Dumbbell, Activity, Calendar } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Progress() {
  const { data: weeklyStats, isLoading: loadingWeekly } = useGetWeeklyStats();
  const { data: muscleStats, isLoading: loadingMuscle } = useGetMuscleGroupStats();
  const { data: summary, isLoading: loadingSummary } = useGetStatsSummary();

  const MUSCLE_COLORS = {
    chest: "hsl(var(--chart-1))",
    back: "hsl(var(--chart-2))",
    shoulders: "hsl(var(--chart-3))",
    arms: "hsl(var(--chart-4))",
    legs: "hsl(var(--chart-5))",
    core: "hsl(var(--primary))",
    fullBody: "hsl(var(--secondary-foreground))",
    cardio: "hsl(var(--muted-foreground))"
  };

  return (
    <motion.div 
      className="space-y-8 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Progress</h1>
        <p className="text-muted-foreground mt-1">Visualize your gains and training distribution.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Volume</div>
            <div className="text-2xl font-black tracking-tighter font-mono">
              {loadingSummary ? <Skeleton className="h-8 w-24" /> : `${summary?.totalVolumeKg.toLocaleString()} kg`}
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Current Streak</div>
            <div className="text-2xl font-black tracking-tighter font-mono">
              {loadingSummary ? <Skeleton className="h-8 w-16" /> : `${summary?.currentStreak} Days`}
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-muted text-foreground flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Completed Sessions</div>
            <div className="text-2xl font-black tracking-tighter font-mono">
              {loadingSummary ? <Skeleton className="h-8 w-12" /> : summary?.completedWorkouts}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* WEEKLY VOLUME LINE CHART */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-primary" />
              Volume Over Time
            </h2>
            <p className="text-sm text-muted-foreground">Total weight moved per week.</p>
          </div>
          <div className="h-[350px] w-full flex-1">
            {loadingWeekly ? (
              <Skeleton className="w-full h-full" />
            ) : weeklyStats && weeklyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolumeProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    formatter={(value: number) => [`${value} kg`, 'Volume']}
                    labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="totalVolumeKg" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorVolumeProgress)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                Not enough data yet
              </div>
            )}
          </div>
        </div>

        {/* WORKOUTS PER WEEK BAR CHART */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Sessions Frequency
            </h2>
            <p className="text-sm text-muted-foreground">Number of completed workouts per week.</p>
          </div>
          <div className="h-[350px] w-full flex-1">
            {loadingWeekly ? (
              <Skeleton className="w-full h-full" />
            ) : weeklyStats && weeklyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}
                    formatter={(value: number) => [value, 'Sessions']}
                  />
                  <Bar dataKey="workoutCount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                Not enough data yet
              </div>
            )}
          </div>
        </div>

        {/* MUSCLE GROUP DISTRIBUTION */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-black uppercase tracking-tighter">Muscle Group Distribution</h2>
            <p className="text-sm text-muted-foreground">Which areas you are focusing on the most.</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="h-[300px] w-full md:w-1/2 flex justify-center">
              {loadingMuscle ? (
                <Skeleton className="w-[250px] h-[250px] rounded-full" />
              ) : muscleStats && muscleStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={muscleStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={4}
                      dataKey="count"
                      nameKey="muscleGroup"
                      stroke="none"
                    >
                      {muscleStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={MUSCLE_COLORS[entry.muscleGroup as keyof typeof MUSCLE_COLORS] || MUSCLE_COLORS.fullBody} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                      formatter={(value: number) => [value, 'Exercises']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-[250px] h-[250px] flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-full">
                  No data
                </div>
              )}
            </div>
            
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              {muscleStats?.map((stat) => (
                <div key={stat.muscleGroup} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: MUSCLE_COLORS[stat.muscleGroup as keyof typeof MUSCLE_COLORS] || MUSCLE_COLORS.fullBody }} />
                    <span className="capitalize font-bold text-sm tracking-tight">{stat.muscleGroup}</span>
                  </div>
                  <span className="font-mono text-muted-foreground text-sm">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
