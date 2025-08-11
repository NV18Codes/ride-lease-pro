import { useState, useMemo } from "react";
import BikeCard from "./BikeCard";
import BikeFilters from "./BikeFilters";
import { useBikes } from "@/hooks/useBikes";
import { Button } from "@/components/ui/button";
import { Grid, List, SlidersHorizontal, Loader2, Sparkles, Zap } from "lucide-react";

const BikeGrid = () => {
  const [filters, setFilters] = useState({
    location: "",
    bikeType: "",
    priceRange: [0, 2000],
    availability: "",
    searchQuery: ""
  });
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");

  // Fetch bikes with filters
  const { data: bikes = [], isLoading, error } = useBikes({
    location: filters.location || undefined,
    type: filters.bikeType || undefined,
    priceRange: filters.priceRange as [number, number],
    searchQuery: filters.searchQuery || undefined,
  });

  // Sort bikes
  const sortedBikes = useMemo(() => {
    const sorted = [...bikes];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price_per_day - b.price_per_day;
        case "price-high":
          return b.price_per_day - a.price_per_day;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return sorted;
  }, [bikes, sortBy]);

  return (
    <section id="bikes" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h2 className="text-5xl font-display font-black text-foreground">
              Choose Your Perfect Ride
            </h2>
            <Zap className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From comfortable scooters to powerful sports bikes, find the perfect vehicle for your journey. 
            <span className="font-semibold text-primary"> Premium quality, competitive prices.</span>
          </p>
        </div>

        {/* Filters */}
        <BikeFilters onFilterChange={setFilters} />

        {/* Enhanced Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-b border-border/50 mb-8">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground text-lg">
              Showing <span className="font-display font-bold text-foreground text-xl">{sortedBikes.length}</span> bikes
              {filters.location && (
                <span> in <span className="font-display font-bold text-primary capitalize">{filters.location}</span></span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Enhanced Sort Options */}
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border-2 border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary font-medium"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Enhanced View Mode Toggle */}
            <div className="flex border-2 border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none border-0 font-medium"
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none border-0 font-medium"
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Bikes Grid/List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-xl text-muted-foreground font-medium">Loading amazing bikes for you...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">⚠️</div>
            <h3 className="text-3xl font-display font-bold text-foreground mb-4">Error loading bikes</h3>
            <p className="text-xl text-muted-foreground mb-6">Please try again later.</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-primary hover:shadow-glow"
            >
              Retry
            </Button>
          </div>
        ) : sortedBikes.length > 0 ? (
          <div className={`pt-8 ${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "space-y-6"
          }`}>
            {sortedBikes.map((bike, index) => (
              <div key={bike.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <BikeCard bike={bike} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🏍️</div>
            <h3 className="text-3xl font-display font-bold text-foreground mb-4">No bikes found</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Try adjusting your filters or search criteria to find more bikes. 
              We have a great selection waiting for you!
            </p>
            <Button 
              onClick={() => setFilters({
                location: "",
                bikeType: "",
                priceRange: [0, 2000],
                availability: "",
                searchQuery: ""
              })}
              className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-3 h-auto font-semibold"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BikeGrid;