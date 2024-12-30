import { Search, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

function AppHeader() {
  return (
    <header className="fixed bg-background top-0 left-0 right-0 container mx-auto flex justify-between gap-8 items-center py-10">
      <div className="">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          NextStore
        </h1>
      </div>
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost">Categories</Button>
        <div className="relative w-full">
          <div className="absolute top-0 left-0">
            <Button size="icon" variant="outline">
              <Search />
            </Button>
          </div>
          <Input className="w-full pl-14" placeholder="Search in nextstore" />
        </div>
        <Button className="aspect-square" size="icon" variant="outline">
          <ShoppingCart />
        </Button>
      </div>
      <div className="flex items-center">
        <Button variant="link">Login</Button>
        <Button variant="link">Register</Button>
      </div>
    </header>
  );
}

export default AppHeader;
