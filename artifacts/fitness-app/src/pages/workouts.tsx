import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useListWorkouts, useCreateWorkout, getListWorkoutsQueryKey } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { Plus, Search, Calendar, Clock, ChevronRight, Activity, CalendarPlus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.string().min(1, "Date is required"),
  durationMinutes: z.coerce.number().optional().or(z.literal("")),
});

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Workouts() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: workouts, isLoading } = useListWorkouts();
  const createWorkout = useCreateWorkout();
  
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Workout",
      date: format(new Date(), "yyyy-MM-dd"),
      durationMinutes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createWorkout.mutate(
      { 
        data: {
          name: values.name,
          date: values.date,
          durationMinutes: values.durationMinutes ? Number(values.durationMinutes) : undefined,
          status: "planned"
        } 
      },
      {
        onSuccess: (newWorkout) => {
          queryClient.invalidateQueries({ queryKey: getListWorkoutsQueryKey() });
          toast({
            title: "Workout Created",
            description: "Ready to crush it.",
          });
          setIsCreateOpen(false);
          setLocation(`/workouts/${newWorkout.id}`);
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Could not create workout.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const filteredWorkouts = workouts?.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    format(parseISO(w.date), "MMM d, yyyy").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Workouts</h1>
          <p className="text-muted-foreground mt-1">Your training history and planned sessions.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="font-bold uppercase tracking-tight w-full md:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="uppercase font-black text-2xl tracking-tighter">Initialize Session</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-bold text-xs tracking-wider">Session Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Upper Body Power" {...field} className="font-bold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase font-bold text-xs tracking-wider">Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="font-mono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="durationMinutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase font-bold text-xs tracking-wider">Est. Duration (min)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="60" {...field} className="font-mono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={createWorkout.isPending} className="w-full font-bold uppercase tracking-tight">
                    {createWorkout.isPending ? "Creating..." : "Create Session"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input 
          placeholder="Search sessions by name or date..." 
          className="pl-10 h-12 text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : filteredWorkouts && filteredWorkouts.length > 0 ? (
        <motion.div 
          className="grid gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredWorkouts.map((workout) => (
            <motion.div key={workout.id} variants={itemVariants}>
              <Link href={`/workouts/${workout.id}`}>
                <div className="bg-card border border-border hover:border-primary/50 rounded-xl p-5 md:p-6 transition-all hover:shadow-md group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="flex items-center gap-4">
                    <div className={`hidden sm:flex w-14 h-14 rounded-xl items-center justify-center font-bold text-xl
                      ${workout.status === 'completed' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                    `}>
                      {parseISO(workout.date).getDate()}
                    </div>
                    <div>
                      <h3 className="font-black text-xl md:text-2xl uppercase tracking-tighter group-hover:text-primary transition-colors">
                        {workout.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2 font-mono">
                        <span className="flex items-center gap-1.5 text-foreground/80">
                          <Calendar className="w-4 h-4" />
                          {format(parseISO(workout.date), "EEEE, MMM d, yyyy")}
                        </span>
                        {workout.durationMinutes && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {workout.durationMinutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-border">
                    <div className="flex items-center gap-6">
                      <div className="text-left">
                        <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Status</div>
                        <div className={`text-xs font-bold uppercase px-2 py-1 rounded-sm border inline-block
                          ${workout.status === 'completed' ? 'border-primary text-primary bg-primary/10' : 'border-muted-foreground text-muted-foreground bg-muted/50'}
                        `}>
                          {workout.status}
                        </div>
                      </div>
                      
                      {workout.totalVolume ? (
                        <div className="text-right">
                          <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Volume</div>
                          <div className="font-mono font-bold text-lg leading-none">{workout.totalVolume.toLocaleString()} <span className="text-xs text-muted-foreground">kg</span></div>
                        </div>
                      ) : (
                        <div className="text-right opacity-30">
                          <div className="text-[10px] uppercase font-bold tracking-widest mb-1">Volume</div>
                          <div className="font-mono font-bold text-lg leading-none">--</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
          <CalendarPlus className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No Sessions Found</h3>
          <p className="text-muted-foreground mb-6">Create your first workout to start tracking your progress.</p>
          <Button onClick={() => setIsCreateOpen(true)} className="font-bold uppercase tracking-tight">
            <Plus className="w-4 h-4 mr-2" /> Initialize Session
          </Button>
        </div>
      )}
    </div>
  );
}
