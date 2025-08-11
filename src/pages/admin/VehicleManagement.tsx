import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  Bike,
  Car,
  Truck,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import AdminLayout from '../../components/admin/AdminLayout';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: 'scooter' | 'motorcycle' | 'car' | 'truck';
  year: number;
  price_per_day: number;
  status: 'available' | 'rented' | 'maintenance' | 'unavailable';
  image_url?: string;
  description?: string;
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  transmission: 'manual' | 'automatic';
  mileage: number;
  color: string;
  created_at: string;
}

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      name: 'Honda Activa',
      brand: 'Honda',
      model: 'Activa 6G',
      type: 'scooter',
      year: 2023,
      price_per_day: 500,
      status: 'available',
      image_url: '/placeholder.svg',
      description: 'Comfortable and fuel-efficient scooter perfect for city rides',
      fuel_type: 'petrol',
      transmission: 'automatic',
      mileage: 45,
      color: 'White',
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Bajaj Pulsar',
      brand: 'Bajaj',
      model: 'Pulsar 150',
      type: 'motorcycle',
      year: 2022,
      price_per_day: 800,
      status: 'rented',
      image_url: '/placeholder.svg',
      description: 'Powerful motorcycle with great performance',
      fuel_type: 'petrol',
      transmission: 'manual',
      mileage: 35,
      color: 'Black',
      created_at: '2024-01-10'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { toast } = useToast();

  const vehicleTypes = [
    { value: 'scooter', label: 'Scooter', icon: Bike },
    { value: 'motorcycle', label: 'Motorcycle', icon: Bike },
    { value: 'car', label: 'Car', icon: Car },
    { value: 'truck', label: 'Truck', icon: Truck },
  ];

  const statusOptions = [
    { value: 'available', label: 'Available', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'rented', label: 'Rented', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'unavailable', label: 'Unavailable', color: 'bg-red-100 text-red-800 border-red-200' },
  ];

  const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid'];
  const transmissionTypes = ['manual', 'automatic'];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddVehicle = (vehicleData: Omit<Vehicle, 'id' | 'created_at'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    
    setVehicles([...vehicles, newVehicle]);
    setShowAddForm(false);
    toast({
      title: "Vehicle Added",
      description: "New vehicle has been added successfully",
      variant: "default",
    });
  };

  const handleEditVehicle = (vehicleData: Vehicle) => {
    setVehicles(vehicles.map(v => v.id === vehicleData.id ? vehicleData : v));
    setEditingVehicle(null);
    toast({
      title: "Vehicle Updated",
      description: "Vehicle information has been updated successfully",
      variant: "default",
    });
  };

  const handleDeleteVehicle = (id: string) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
      toast({
        title: "Vehicle Deleted",
        description: "Vehicle has been removed successfully",
        variant: "default",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption?.color || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type: string) => {
    const typeOption = vehicleTypes.find(t => t.value === type);
    return typeOption?.icon || Bike;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
            <p className="text-gray-600 mt-1">Manage your fleet of vehicles</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-500 flex items-center justify-center">
                {filteredVehicles.length} vehicles found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => {
            const TypeIcon = getTypeIcon(vehicle.type);
            return (
              <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{vehicle.name}</CardTitle>
                        <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Vehicle Image */}
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <img
                      src={vehicle.image_url || '/placeholder.svg'}
                      alt={vehicle.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Vehicle Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Year:</span>
                      <p className="font-medium">{vehicle.year}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Price/Day:</span>
                      <p className="font-medium">₹{vehicle.price_per_day}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Fuel:</span>
                      <p className="font-medium capitalize">{vehicle.fuel_type}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Transmission:</span>
                      <p className="font-medium capitalize">{vehicle.transmission}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Mileage:</span>
                      <p className="font-medium">{vehicle.mileage} km/l</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Color:</span>
                      <p className="font-medium">{vehicle.color}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditingVehicle(vehicle)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add/Edit Vehicle Form */}
        {(showAddForm || editingVehicle) && (
          <VehicleForm
            vehicle={editingVehicle}
            onSubmit={editingVehicle ? handleEditVehicle : handleAddVehicle}
            onCancel={() => {
              setShowAddForm(false);
              setEditingVehicle(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Vehicle Form Component
interface VehicleFormProps {
  vehicle?: Vehicle | null;
  onSubmit: (data: Omit<Vehicle, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    name: vehicle?.name || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    type: vehicle?.type || 'scooter',
    year: vehicle?.year || new Date().getFullYear(),
    price_per_day: vehicle?.price_per_day || 0,
    status: vehicle?.status || 'available',
    image_url: vehicle?.image_url || '',
    description: vehicle?.description || '',
    fuel_type: vehicle?.fuel_type || 'petrol',
    transmission: vehicle?.transmission || 'manual',
    mileage: vehicle?.mileage || 0,
    color: vehicle?.color || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="fixed inset-4 z-50 overflow-y-auto bg-white">
      <CardHeader>
        <CardTitle>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_day">Price per Day (₹)</Label>
              <Input
                id="price_per_day"
                type="number"
                value={formData.price_per_day}
                onChange={(e) => setFormData({...formData, price_per_day: parseInt(e.target.value)})}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuel_type">Fuel Type</Label>
              <Select value={formData.fuel_type} onValueChange={(value) => setFormData({...formData, fuel_type: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.transmission} onValueChange={(value) => setFormData({...formData, transmission: value as any})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transmissionTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage (km/l)</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData({...formData, mileage: parseInt(e.target.value)})}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
