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
      {/* Search Bar */}
      <Card className="p-6 bg-gradient-card shadow-soft">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search" className="text-sm font-medium mb-2 block">
              Search Bikes
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="search"
                placeholder="Search by bike name, model, or features..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="md:w-64">
            <Label htmlFor="location" className="text-sm font-medium mb-2 block">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-end">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <Card className="p-6 bg-gradient-card shadow-soft">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Bike Type */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Bike Type</Label>
              <Select value={filters.bikeType} onValueChange={(value) => handleFilterChange("bikeType", value)}>
                <SelectTrigger>
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

            {/* Availability */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Availability</Label>
              <Select value={filters.availability} onValueChange={(value) => handleFilterChange("availability", value)}>
                <SelectTrigger>
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

            {/* Price Range */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}/day
              </Label>
              <div className="px-2 pt-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange("priceRange", value)}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 gap-3">
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
            <Button onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BikeFilters;