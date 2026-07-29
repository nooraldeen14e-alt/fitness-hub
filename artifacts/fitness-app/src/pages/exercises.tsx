import { useState, useMemo } from "react";
import { useListExercises, useCreateExercise, getListExercisesQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Dumbbell, Activity, Flame, StretchHorizontal, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["strength", "cardio", "flexibility", "bodyweight"]),
  muscleGroup: z.enum(["chest", "back", "shoulders", "arms", "core", "legs", "fullBody", "cardio"]),
  description: z.string().optional(),
});

const CATEGORY_ICONS = {
  strength: <Dumbbell className="w-4 h-4" />,
  cardio: <Activity className="w-4 h-4" />,
  flexibility: <StretchHorizontal className="w-4 h-4" />,
  bodyweight: <Flame className="w-4 h-4" />
};

export default function Exercises() {
  const { data: exercises, isLoading } = useListExercises();
  const createExercise = useCreateExercise();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "strength",
      muscleGroup: "chest",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createExercise.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListExercisesQueryKey() });
          toast({ title: "Exercise added to library." });
          setIsCreateOpen(false);
          form.reset();
        },
        onError: () => {
          toast({ title: "Failed to add exercise.", variant: "destructive" });
        }
      }
    );
  };

  const filteredExercises = useMemo(() => {
    if (!exercises) return [];
    return exercises.filter(ex => {
      const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "all" || ex.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [exercises, search, categoryFilter]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Library</h1>
          <p className="text-muted-foreground mt-1">Manage your exercise movements.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="font-bold uppercase tracking-tight w-full md:w-auto">
              <Plus className="w-5 h-5 mr-2" />
              New Movement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="uppercase font-black text-2xl tracking-tighter">Add Movement</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-bold text-xs tracking-wider">Exercise Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Barbell Bench Press" {...field} className="font-bold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase font-bold text-xs tracking-wider">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="font-bold capitalize">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="strength">Strength</SelectItem>
                            <SelectItem value="bodyweight">Bodyweight</SelectItem>
                            <SelectItem value="cardio">Cardio</SelectItem>
                            <SelectItem value="flexibility">Flexibility</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="muscleGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="uppercase font-bold text-xs tracking-wider">Focus Area</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="font-bold capitalize">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="chest">Chest</SelectItem>
                            <SelectItem value="back">Back</SelectItem>
                            <SelectItem value="legs">Legs</SelectItem>
                            <SelectItem value="shoulders">Shoulders</SelectItem>
                            <SelectItem value="arms">Arms</SelectItem>
                            <SelectItem value="core">Core</SelectItem>
                            <SelectItem value="fullBody">Full Body</SelectItem>
                            <SelectItem value="cardio">Cardio</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase font-bold text-xs tracking-wider">Notes / Cue (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g. Keep shoulders retracted" {...field} className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={createExercise.isPending} className="w-full font-bold uppercase tracking-tight">
                    {createExercise.isPending ? "Adding..." : "Add to Library"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search movements..." 
            className="pl-10 h-12 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px] h-12 font-bold uppercase tracking-tight">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ALL CATEGORIES</SelectItem>
            <SelectItem value="strength">STRENGTH</SelectItem>
            <SelectItem value="bodyweight">BODYWEIGHT</SelectItem>
            <SelectItem value="cardio">CARDIO</SelectItem>
            <SelectItem value="flexibility">FLEXIBILITY</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredExercises.map((exercise) => (
              <motion.div
                key={exercise.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-card border border-border p-5 rounded-xl hover:border-primary/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-black text-xl uppercase tracking-tighter leading-tight">{exercise.name}</h3>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                      {CATEGORY_ICONS[exercise.category as keyof typeof CATEGORY_ICONS]}
                    </div>
                  </div>
                  {exercise.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {exercise.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm border border-primary/20">
                    {exercise.muscleGroup}
                  </span>
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-widest rounded-sm border border-border">
                    {exercise.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-dashed border-border rounded-xl">
          <Dumbbell className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No Movements Found</h3>
          <p className="text-muted-foreground mb-6">Your search didn't match any exercises in the library.</p>
        </div>
      )}
    </div>
  );
}
