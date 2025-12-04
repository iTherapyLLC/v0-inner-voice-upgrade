"use client"

import Image from "next/image"

export function ShowcaseImages() {
  return (
    <>
      {/* Image 1: Top left - Child learning */}
      <div className="absolute z-10 hidden md:block" style={{ top: "12%", left: "3%" }}>
        <div className="relative animate-float-delayed">
          <div className="w-56 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop"
              alt="Child finding their voice through communication"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Image 2: Middle left - Reading together */}
      <div className="absolute z-10 hidden md:block" style={{ top: "38%", left: "1%" }}>
        <div className="relative animate-float">
          <div className="w-52 h-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[4deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=400&h=300&fit=crop"
              alt="Child learning to read"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Image 3: Bottom left - Learning moment */}
      <div className="absolute z-10 hidden md:block" style={{ top: "64%", left: "4%" }}>
        <div className="relative animate-float-slow">
          <div className="w-60 h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&h=300&fit=crop"
              alt="Child experiencing a learning breakthrough"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Image 4: Top right - Child playing */}
      <div className="absolute z-10 hidden lg:block" style={{ top: "10%", right: "2%" }}>
        <div className="relative animate-float-slow">
          <div className="w-52 h-38 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[5deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&h=300&fit=crop"
              alt="Child playing and learning"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Image 5: Middle right - Friendship */}
      <div className="absolute z-10 hidden lg:block" style={{ top: "36%", right: "1%" }}>
        <div className="relative animate-float-delayed">
          <div className="w-56 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[-4deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=300&fit=crop"
              alt="Children building friendship through communication"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Image 6: Bottom right - Success */}
      <div className="absolute z-10 hidden lg:block" style={{ top: "66%", right: "5%" }}>
        <div className="relative animate-float">
          <div className="w-54 h-38 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[3deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop"
              alt="Child celebrating success"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>
    </>
  )
}
