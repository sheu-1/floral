export default function Loading() {
  return (
    <div className="min-h-screen pt-20 bg-gradient-floral flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Spinning flower */}
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
          
          {/* Floating petals */}
          <div className="absolute inset-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary-400 rounded-full animate-float"
                style={{
                  left: `${20 + i * 10}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s',
                }}
              />
            ))}
          </div>
        </div>
        
        <h2 className="font-serif text-xl font-semibold text-neutral-900 mb-2">
          Loading...
        </h2>
        <p className="text-neutral-600">
          Preparing something beautiful for you
        </p>
      </div>
    </div>
  )
}
