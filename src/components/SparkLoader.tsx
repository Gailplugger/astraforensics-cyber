import { motion } from 'framer-motion'
import { Robot, Lightning, Cpu, Network } from '@phosphor-icons/react'

interface SparkLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  variant?: 'spinner' | 'pulse' | 'orbit' | 'matrix' | 'neural'
  className?: string
}

export function SparkLoader({ 
  size = 'md', 
  text = 'Loading...', 
  variant = 'spinner',
  className = '' 
}: SparkLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  if (variant === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} relative`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="spark-spinner rounded-full h-full w-full border-4 border-transparent"></div>
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{ background: 'var(--spark-electric)' }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        
        {text && (
          <motion.p 
            className={`${textSizes[size]} text-muted-foreground font-medium`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {text}
          </motion.p>
        )}
        
        {/* Floating spark particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `var(--spark-${['electric', 'neon', 'plasma'][i % 3]})`,
              boxShadow: `0 0 4px var(--spark-${['electric', 'neon', 'plasma'][i % 3]})`
            }}
            animate={{
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} rounded-full relative overflow-hidden`}
          style={{ background: 'var(--gradient-spark)' }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0.2, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-4 rounded-full flex items-center justify-center"
            style={{ background: 'var(--background)' }}
          >
            <Robot size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 32} 
                   className="text-primary" />
          </motion.div>
        </motion.div>
        
        {text && (
          <motion.p 
            className={`${textSizes[size]} text-muted-foreground font-medium gradient-text`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'orbit') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className={`${sizeClasses[size]} relative`}>
          {/* Central core */}
          <motion.div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{ background: 'var(--gradient-spark)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Lightning size={size === 'sm' ? 12 : size === 'md' ? 16 : size === 'lg' ? 20 : 24} 
                      className="text-white" />
          </motion.div>
          
          {/* Orbiting particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `var(--spark-${['electric', 'neon', 'plasma'][i]})`,
                boxShadow: `0 0 6px var(--spark-${['electric', 'neon', 'plasma'][i]})`,
                transformOrigin: `${sizeClasses[size] === 'w-8 h-8' ? '20px' : 
                  sizeClasses[size] === 'w-12 h-12' ? '30px' :
                  sizeClasses[size] === 'w-16 h-16' ? '40px' : '60px'} 50%`
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.5, 1]
              }}
              transition={{
                rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, delay: i * 0.5 }
              }}
            />
          ))}
        </div>
        
        {text && (
          <motion.p 
            className={`${textSizes[size]} text-muted-foreground font-medium`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'matrix') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className={`${sizeClasses[size]} relative overflow-hidden rounded-lg`}>
          {/* Matrix background */}
          <div className="absolute inset-0 bg-black/80 rounded-lg">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 bg-gradient-to-b from-transparent via-green-400 to-transparent"
                style={{
                  left: `${(i * 12.5)}%`,
                  height: '200%'
                }}
                animate={{
                  y: ['-100%', '100%']
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear'
                }}
              />
            ))}
          </div>
          
          {/* Central icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Cpu size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 32} 
                 className="text-green-400" />
          </motion.div>
        </div>
        
        {text && (
          <motion.p 
            className={`${textSizes[size]} text-green-400 font-mono font-medium`}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  if (variant === 'neural') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className={`${sizeClasses[size]} relative`}>
          {/* Neural network nodes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: `var(--spark-${['electric', 'neon', 'plasma'][i % 3]})`,
                boxShadow: `0 0 6px var(--spark-${['electric', 'neon', 'plasma'][i % 3]})`,
                left: `${20 + (i % 3) * 30}%`,
                top: `${20 + Math.floor(i / 3) * 60}%`
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {[...Array(5)].map((_, i) => (
              <motion.line
                key={i}
                x1={`${20 + (i % 3) * 30}%`}
                y1={`${20 + Math.floor(i / 3) * 60}%`}
                x2={`${20 + ((i + 1) % 3) * 30}%`}
                y2={`${20 + Math.floor((i + 1) / 3) * 60}%`}
                stroke="var(--spark-electric)"
                strokeWidth="1"
                opacity="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              />
            ))}
          </svg>
          
          {/* Central brain icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotateY: [0, 180, 360]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Network size={size === 'sm' ? 16 : size === 'md' ? 20 : size === 'lg' ? 24 : 32} 
                    className="text-primary" />
          </motion.div>
        </div>
        
        {text && (
          <motion.p 
            className={`${textSizes[size]} text-muted-foreground font-medium`}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              y: [0, -2, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
        )}
      </div>
    )
  }

  // Default fallback to spinner
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} spark-spinner rounded-full border-4 border-transparent`}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {text && (
        <p className={`${textSizes[size]} text-muted-foreground font-medium`}>
          {text}
        </p>
      )}
    </div>
  )
}

// Convenience components for common use cases
export const SparkSpinner = (props: Omit<SparkLoaderProps, 'variant'>) => 
  <SparkLoader {...props} variant="spinner" />

export const SparkPulse = (props: Omit<SparkLoaderProps, 'variant'>) => 
  <SparkLoader {...props} variant="pulse" />

export const SparkOrbit = (props: Omit<SparkLoaderProps, 'variant'>) => 
  <SparkLoader {...props} variant="orbit" />

export const SparkMatrix = (props: Omit<SparkLoaderProps, 'variant'>) => 
  <SparkLoader {...props} variant="matrix" />

export const SparkNeural = (props: Omit<SparkLoaderProps, 'variant'>) => 
  <SparkLoader {...props} variant="neural" />