import { useGetStatsSummary, useListWorkouts, useGetWeeklyStats, useGetMuscleGroupStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Activity, Flame, Dumbbell, Calendar, ChevronRight, Clock, ArrowRight, LineChart, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";

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

export default function Dashboard() {
  const { data: summary, isLoading: loadingSummary } = useGetStatsSummary();
  const { data: workouts, isLoading: loadingWorkouts } = useListWorkouts();
  const { data: weeklyStats, isLoading: loadingWeekly } = useGetWeeklyStats();
  const { data: muscleStats, isLoading: loadingMuscle } = useGetMuscleGroupStats();

  const recentWorkouts = workouts?.slice(0, 5) || [];

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
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Performance</h1>
          <p className="text-muted-foreground mt-1">Overview of your training metrics.</p>
        </div>
        <Link href="/workouts">
          <Button size="lg" className="font-bold uppercase tracking-tight w-full md:w-auto">
            <Plus className="w-5 h-5 mr-2" />
            Log Workout
          </Button>
        </Link>
      </motion.div>

      {/* STATS GRID */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Volume" 
          value={loadingSummary ? <Skeleton className="h-10 w-24" /> : `${summary?.totalVolumeKg.toLocaleString()} kg`}
          icon={<Dumbbell className="w-5 h-5 text-primary" />}
        />
        <StatCard 
          title="Current Streak" 
          value={loadingSummary ? <Skeleton className="h-10 w-16" /> : `${summary?.currentStreak} days`}
          icon={<Flame className="w-5 h-5 text-orange-500" />}
        />
        <StatCard 
          title="Workouts (Week)" 
          value={loadingSummary ? <Skeleton className="h-10 w-12" /> : summary?.thisWeekWorkouts}
          icon={<Activity className="w-5 h-5 text-primary" />}
        />
        <StatCard 
          title="Completed" 
          value={loadingSummary ? <Skeleton className="h-10 w-16" /> : summary?.completedWorkouts}
          icon={<Calendar className="w-5 h-5 text-muted-foreground" />}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN CHART */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-primary" />
            Weekly Volume
          </h2>
          <div className="h-[300px] w-full">
            {loadingWeekly ? (
              <Skeleton className="w-full h-full" />
            ) : weeklyStats && weeklyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
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
                  />
                  <Area type="monotone" dataKey="totalVolumeKg" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                No data available
              </div>
            )}
          </div>
        </motion.div>

        {/* PIE CHART */}
        <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold uppercase tracking-tight mb-6">Focus Area</h2>
          <div className="h-[220px] w-full flex items-center justify-center">
            {loadingMuscle ? (
              <Skeleton className="w-full h-full rounded-full" />
            ) : muscleStats && muscleStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={muscleStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
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
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-full">
                No data
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {muscleStats?.map((stat) => (
              <div key={stat.muscleGroup} className="flex items-center gap-1.5 text-xs font-mono">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MUSCLE_COLORS[stat.muscleGroup as keyof typeof MUSCLE_COLORS] || MUSCLE_COLORS.fullBody }} />
                <span className="capitalize">{stat.muscleGroup}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RECENT WORKOUTS */}
      <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
          <h2 className="text-lg font-bold uppercase tracking-tight">Recent Workouts</h2>
          <Link href="/workouts" className="text-sm text-primary hover:underline flex items-center gap-1 font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {loadingWorkouts ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))
          ) : recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout) => (
              <Link 
                key={workout.id} 
                href={`/workouts/${workout.id}`}
                className="flex items-center justify-between p-4 md:p-6 hover:bg-muted/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex w-12 h-12 rounded-lg bg-primary/10 text-primary items-center justify-center font-bold">
                    {parseISO(workout.date).getDate()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{workout.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {format(parseISO(workout.date), "MMM d, yyyy")}
                      </span>
                      {workout.durationMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {workout.durationMinutes} min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {workout.totalVolume ? (
                    <div className="hidden md:block text-right">
                      <div className="text-sm text-muted-foreground uppercase text-[10px] tracking-wider">Volume</div>
                      <div className="font-mono font-bold">{workout.totalVolume.toLocaleString()} kg</div>
                    </div>
                  ) : null}
                  <div className={`px-2.5 py-1 text-xs font-bold uppercase rounded-sm border ${workout.status === 'completed' ? 'border-primary text-primary bg-primary/10' : 'border-muted-foreground text-muted-foreground'}`}>
                    {workout.status}
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p>No workouts logged yet.</p>
              <Link href="/workouts">
                <Button variant="link" className="text-primary mt-2">Log your first session</Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: React.ReactNode, icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-black tracking-tighter font-mono">{value}</div>
    </div>
  );
}
