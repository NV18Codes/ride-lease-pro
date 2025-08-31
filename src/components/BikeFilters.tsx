import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MapPin, Search, Filter, X } from "lucide-react";

interface BikeFiltersProps {
  onFilterChange: (filters: any) => void;
}

const BikeFilters = ({ onFilterChange }: BikeFiltersProps) => {
  const [filters, setFilters] = useState({
    location: "",
    bikeType: "",
    priceRange: [0, 2000],
    availability: "",
    searchQuery: ""
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      location: "",
      bikeType: "",
      priceRange: [0, 2000],
      availability: "",
      searchQuery: ""
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search Bar */}
      <Card className="p-8 bg-gradient-card shadow-soft border-0">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Label htmlFor="search" className="text-base font-semibold mb-3 block text-foreground">
              <Search className="h-5 w-5 inline mr-2 text-primary" />
              Search Bikes
            </Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="Search by bike name, model, or features..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                className="pl-12 h-12 text-base border-2 border-border focus:border-primary transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          </div>
          
          <div className="md:w-72">
            <Label htmlFor="location" className="text-base font-semibold mb-3 block text-foreground">
              <MapPin className="h-5 w-5 inline mr-2 text-primary" />
              Location
            </Label>
            <div className="relative">
              <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                <SelectTrigger className="pl-12 h-12 text-base border-2 border-border focus:border-primary transition-all duration-300">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malpe">Malpe, Udupi</SelectItem>
                  <SelectItem value="udupi">Udupi City</SelectItem>
                  <SelectItem value="mangalore">Mangalore</SelectItem>
                  <SelectItem value="manipal">Manipal</SelectItem>
                  <SelectItem value="kundapura">Kundapura</SelectItem>
                </SelectContent>
              </Select>
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          </div>

          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-3 h-12 px-6 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-semibold"
            >
              <Filter className="h-5 w-5" />
              {isFilterOpen ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Enhanced Advanced Filters */}
      {isFilterOpen && (
        <Card className="p-8 bg-gradient-card shadow-soft border-0 animate-slide-up">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">

              <h3 className="text-2xl font-display font-bold text-foreground">Advanced Filters</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsFilterOpen(false)}
              className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Enhanced Bike Type */}
            <div>
              <Label className="text-base font-semibold mb-3 block text-foreground">Bike Type</Label>
              <Select value={filters.bikeType} onValueChange={(value) => handleFilterChange("bikeType", value)}>
                <SelectTrigger className="h-12 text-base border-2 border-border focus:border-primary transition-all duration-300">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="scooter">Scooter</SelectItem>
                  <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  <SelectItem value="sports">Sports Bike</SelectItem>
                  <SelectItem value="cruiser">Cruiser</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Enhanced Availability */}
            <div>
              <Label className="text-base font-semibold mb-3 block text-foreground">Availability</Label>
              <Select value={filters.availability} onValueChange={(value) => handleFilterChange("availability", value)}>
                <SelectTrigger className="h-12 text-base border-2 border-border focus:border-primary transition-all duration-300">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Time</SelectItem>
                  <SelectItem value="now">Available Now</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="weekend">This Weekend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Enhanced Price Range */}
            <div>
              <Label className="text-base font-semibold mb-3 block text-foreground">
                Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}/day
              </Label>
              <div className="px-3 pt-3">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange("priceRange", value)}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>₹0</span>
                  <span>₹2000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8 gap-4">
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="border-2 border-border hover:border-destructive hover:text-destructive transition-all duration-300 font-semibold px-6 py-3 h-auto"
            >
              Clear All
            </Button>
            <Button 
              onClick={() => setIsFilterOpen(false)}
              className="bg-gradient-primary hover:shadow-glow font-semibold px-6 py-3 h-auto"
            >
              Apply Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BikeFilters;