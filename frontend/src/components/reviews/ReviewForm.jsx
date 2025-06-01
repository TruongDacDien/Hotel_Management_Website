import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/use-auth";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Stars } from "./Stars";
import { createRatingByRoom, createRatingByService } from "../../config/api";

const formSchema = z.object({
  content: z.string().min(10, "Nội dung phải tối thiểu 10 kí tự"),
  rating: z.number().min(1).max(5),
  roomId: z.number().nullable().optional(),
  serviceId: z.number().nullable().optional(),
});

export default function ReviewForm({ roomId, serviceId, onSuccess }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      rating: 5,
      roomId: roomId || null,
      serviceId: serviceId || null,
    },
  });

  const onSubmit = async (data) => {
    const isRoomReview = !!roomId;
    const isServiceReview = !!serviceId;

    const reviewData = {
      MaTKKH: user?.id,
      SoSao: selectedRating,
      NoiDung: data.content,
    };

    if (isRoomReview) {
      reviewData.MaLoaiPhong = roomId;
    }

    if (isServiceReview) {
      reviewData.MaDV = serviceId;
    }
    try {
      setIsSubmitting(true);
      console.log(reviewData);

      if (isRoomReview) {
        await createRatingByRoom(reviewData);
      } else if (isServiceReview) {
        await createRatingByService(reviewData);
      } else {
        throw new Error("Thiếu roomId hoặc serviceId.");
      }

      form.reset();
      setSelectedRating(5);

      if (onSuccess) onSuccess();
    } catch (err) {
      toast({
        title: "Gửi thất bại",
        description: err.message || "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hãy chia sẻ trải nghiệm của bạn</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">
            Vui lòng{" "}
            <a href="/auth" className="text-primary font-medium">
              đăng nhập
            </a>{" "}
            để gửi đánh giá.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hãy chia sẻ trải nghiệm của bạn</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={() => (
                <FormItem>
                  <FormLabel>Đánh giá</FormLabel>
                  <FormControl>
                    <Stars
                      rating={selectedRating}
                      editable={true}
                      onRatingChange={setSelectedRating}
                      size="lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Viết chi tiết về trải nghiệm của bạn..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              variant="custom"
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
