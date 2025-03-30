import { useQuery } from '@tanstack/react-query';
import { User, Review } from '@shared/schema';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { Stars } from '@/components/reviews/Stars';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ReviewListProps {
  roomId?: number;
  serviceId?: number;
}

export default function ReviewList({ roomId, serviceId }: ReviewListProps) {
  const queryKey = roomId 
    ? [`/api/reviews/room/${roomId}`] 
    : serviceId 
      ? [`/api/reviews/service/${serviceId}`] 
      : ['/api/reviews'];

  const { data: reviews, isLoading, error } = useQuery<Review[]>({
    queryKey,
    // Use the default fetcher configured in queryClient.ts
  });

  if (isLoading) {
    return (
      <div className="py-8 space-y-4">
        <div className="h-28 bg-muted rounded-lg animate-pulse"></div>
        <div className="h-28 bg-muted rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center">
        <p>Failed to load reviews. Please try again later.</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-8 text-center">
        <p>No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      <h3 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h3>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  const { data: user } = useQuery<User>({
    queryKey: ['/api/user', review.userId],
    // It's fine if this is missing, we'll handle it elegantly below
    enabled: !!review.userId,
  });

  // Get user's initials for the avatar fallback
  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'GU'; // Guest User
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{user?.name || 'Guest User'}</h4>
              <p className="text-sm text-muted-foreground">
                {review.createdAt ? format(new Date(review.createdAt), 'PPP') : 'Recently'}
              </p>
            </div>
          </div>
          <Stars rating={review.rating} />
        </div>
      </CardHeader>
      <CardContent>
        <h5 className="font-medium mb-2">{review.title}</h5>
        <p className="text-muted-foreground">{review.content}</p>
      </CardContent>
    </Card>
  );
}