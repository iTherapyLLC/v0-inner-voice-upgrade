"use client"

import Image from "next/image"

// Explicit rendering of each image to avoid v0 array mapping issues
export function ShowcaseImages() {
  return (
    <>
      {/* Image 1: Top left - Child finding voice */}
      <div className="absolute z-10 hidden md:block" style={{ top: "12%", left: "3%" }}>
        <div className="relative animate-float-delayed">
          <div className="w-56 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="/showcase/child-communicating.jpg"
              alt="Child finding their voice through communication"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Image 2: Middle left - Story adventure */}
      <div className="absolute z-10 hidden md:block" style={{ top: "38%", left: "1%" }}>
        <div className="relative animate-float">
          <div className="w-52 h-36 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[4deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="/showcase/story-adventure.jpg"
              alt="Magical story adventure scene"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Image 3: Bottom left - Learning moment */}
      <div className="absolute z-10 hidden md:block" style={{ top: "64%", left: "4%" }}>
        <div className="relative animate-float-slow">
          <div className="w-60 h-44 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="/showcase/learning-moment.jpg"
              alt="Child experiencing a learning breakthrough"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Image 4: Top right - Brave moment */}
      <div className="absolute z-10 hidden lg:block" style={{ top: "10%", right: "2%" }}>
        <div className="relative animate-float-slow">
          <div className="w-52 h-38 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[5deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="/showcase/brave-dentist.jpg"
              alt="Child being brave at the dentist"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Image 5: Middle right - Friendship */}
      <div className="absolute z-10 hidden lg:block" style={{ top: "36%", right: "1%" }}>
        <div className="relative animate-float-delayed">
          <div className="w-56 h-40 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[-4deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="/showcase/friendship-scene.jpg"
              alt="Children building friendship through communication"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Image 6: Bottom right - Triumph */}
      <div className="absolute z-10 hidden lg:block" style={{ top: "66%", right: "5%" }}>
        <div className="relative animate-float">
          <div className="w-54 h-38 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 rotate-[3deg] hover:rotate-0 transition-transform duration-500">
            <Image
              src="/showcase/triumph-moment.jpg"
              alt="Child celebrating a communication triumph"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </>
  )
}
