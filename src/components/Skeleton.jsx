// Reusable Skeleton Loader Components

// Base skeleton with shimmer animation
export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

// Text line skeleton
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-gray-200 rounded animate-pulse ${
          i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
        }`}
      />
    ))}
  </div>
);

// Circle skeleton (for avatars)
export const SkeletonCircle = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };
  return <div className={`${sizes[size]} rounded-full bg-gray-200 animate-pulse ${className}`} />;
};

// Card skeleton for support requests
export const SupportCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    {/* Category badge */}
    <Skeleton className="w-20 h-6 rounded-full mb-3" />

    {/* Title */}
    <Skeleton className="w-3/4 h-6 mb-2" />

    {/* Description */}
    <SkeletonText lines={2} className="mb-4" />

    {/* Meta info */}
    <div className="flex gap-4 mb-4">
      <Skeleton className="w-24 h-4" />
      <Skeleton className="w-20 h-4" />
      <Skeleton className="w-28 h-4" />
    </div>

    {/* Vote section */}
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div className="flex items-center gap-4">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-20 h-5" />
      </div>
      <Skeleton className="w-24 h-10 rounded-lg" />
    </div>

    {/* Comments section */}
    <div className="mt-4 pt-4 border-t border-gray-100">
      <Skeleton className="w-32 h-4 mb-3" />
      <div className="space-y-2">
        <Skeleton className="w-full h-16 rounded-lg" />
      </div>
    </div>
  </div>
);

// Card skeleton for jobs
export const JobCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <Skeleton className="w-2/3 h-5 mb-2" />
        <Skeleton className="w-1/3 h-4" />
      </div>
      <Skeleton className="w-20 h-6 rounded-full" />
    </div>

    <div className="flex gap-4 mb-4">
      <Skeleton className="w-28 h-4" />
      <Skeleton className="w-32 h-4" />
      <Skeleton className="w-24 h-4" />
    </div>

    <SkeletonText lines={2} />
  </div>
);

// Card skeleton for news
export const NewsCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
    {/* Image */}
    <Skeleton className="w-full h-48" />

    <div className="p-6">
      {/* Category & Date */}
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-20 h-5 rounded-full" />
        <Skeleton className="w-24 h-4" />
      </div>

      {/* Title */}
      <Skeleton className="w-full h-6 mb-2" />

      {/* Excerpt */}
      <SkeletonText lines={2} className="mb-4" />

      {/* Read more */}
      <Skeleton className="w-24 h-4" />
    </div>
  </div>
);

// Card skeleton for directory members
export const MemberCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center mb-4">
      <SkeletonCircle size="lg" className="mr-4" />
      <div className="flex-1">
        <Skeleton className="w-32 h-5 mb-2" />
        <Skeleton className="w-20 h-4" />
      </div>
    </div>

    <div className="space-y-2">
      <Skeleton className="w-full h-4" />
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-1/2 h-4" />
    </div>
  </div>
);

// Card skeleton for executives
export const ExecutiveCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
    {/* Image */}
    <Skeleton className="w-full h-64" />

    <div className="p-6">
      {/* Name */}
      <Skeleton className="w-2/3 h-6 mb-2" />

      {/* Position */}
      <Skeleton className="w-1/2 h-4 mb-4" />

      {/* Bio */}
      <SkeletonText lines={3} className="mb-4" />

      {/* Social links */}
      <div className="flex gap-3">
        <SkeletonCircle size="sm" />
        <SkeletonCircle size="sm" />
        <SkeletonCircle size="sm" />
      </div>
    </div>
  </div>
);

// Stat card skeleton for home page
export const StatCardSkeleton = () => (
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl" />
    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
      <div className="flex justify-center mb-3">
        <SkeletonCircle size="sm" className="bg-white/20" />
      </div>
      <div className="flex justify-center mb-1">
        <Skeleton className="w-16 h-8 bg-white/20" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="w-20 h-4 bg-white/20" />
      </div>
    </div>
  </div>
);

// Full page loading skeleton
export const PageLoadingSkeleton = ({ type = 'cards', count = 6 }) => {
  const skeletons = {
    support: SupportCardSkeleton,
    jobs: JobCardSkeleton,
    news: NewsCardSkeleton,
    members: MemberCardSkeleton,
    executives: ExecutiveCardSkeleton,
    cards: JobCardSkeleton,
  };

  const SkeletonComponent = skeletons[type] || skeletons.cards;
  const gridCols = type === 'support' ? 'lg:grid-cols-2' :
                   type === 'executives' ? 'md:grid-cols-2 lg:grid-cols-3' :
                   'md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

export default {
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  SupportCardSkeleton,
  JobCardSkeleton,
  NewsCardSkeleton,
  MemberCardSkeleton,
  ExecutiveCardSkeleton,
  StatCardSkeleton,
  PageLoadingSkeleton,
};
