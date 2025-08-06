import { useState, useMemo } from "react";
import BikeCard from "./BikeCard";
import BikeFilters from "./BikeFilters";
import { bikesData } from "@/data/bikesData";
import { Button } from "@/components/ui/button";
import { Grid, List, SlidersHorizontal } from "lucide-react";

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

  // Filter and sort bikes
  const filteredBikes = useMemo(() => {
    let filtered = bikesData.filter(bike => {
      // Location filter
      if (filters.location && bike.location.toLowerCase() !== filters.location.toLowerCase()) {
        return false;
      }
      
      // Bike type filter
      if (filters.bikeType && bike.type.toLowerCase() !== filters.bikeType.toLowerCase()) {
        return false;
      }
      
      // Price range filter
      if (bike.pricePerDay < filters.priceRange[0] || bike.pricePerDay > filters.priceRange[1]) {
        return false;
      }
      
      // Availability filter
      if (filters.availability === "now" && !bike.available) {
        return false;
      }
      
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${bike.name} ${bike.model} ${bike.type} ${bike.features.join(" ")}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }
      
      return true;
    });

    // Sort bikes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricePerDay - b.pricePerDay;
        case "price-high":
          return b.pricePerDay - a.pricePerDay;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [filters, sortBy]);

  return (
    <section id="bikes" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
            Choose Your Perfect Ride
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From comfortable scooters to powerful sports bikes, find the perfect vehicle for your journey
          </p>
        </div>

        {/* Filters */}
        <BikeFilters onFilterChange={setFilters} />

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-b border-border">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredBikes.length}</span> bikes
              {filters.location && (
                <span> in <span className="font-semibold text-foreground capitalize">{filters.location}</span></span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bikes Grid/List */}
        {filteredBikes.length > 0 ? (
          <div className={`pt-8 ${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }`}>
            {filteredBikes.map((bike) => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏍️</div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No bikes found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search criteria to find more bikes.
            </p>
            <Button 
              onClick={() => setFilters({
                location: "",
                bikeType: "",
                priceRange: [0, 2000],
                availability: "",
                searchQuery: ""
              })}
              className="bg-gradient-primary"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BikeGrid;