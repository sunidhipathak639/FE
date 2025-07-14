// src/App.tsx

import { Button } from "@/components/ui/button";

export default function App() {
  const handleClick = () => {
    console.log("Button clicked!");
  };

  return (
    <div className="min-h-screen   flex items-center justify-center bg-[#000] text-foreground">
      <div className="p-6 rounded-lg shadow-md border  bg-red-500 h-96 w-96">
        <Button onClick={handleClick}   className="bg-blue-500 text-white p-4 text-xl">
          Click Me
        </Button>
      </div>
    </div>
  );
}
