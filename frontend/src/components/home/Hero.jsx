import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Luxury hotel exterior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/40"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Trải nghiệm sự sang trọng
          </h1>
          <p className="text-xl md:text-2xl text-white mb-10 max-w-2xl mx-auto">
            Khám phá sự kết hợp hoàn hảo giữa sự thanh lịch, thoải mái và dịch
            vụ đặc biệt tại khách sạn của chúng tôi.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link to="/rooms">
              <Button
                size="lg"
                className="bg-amber-300 hover:bg-amber-400 text-neutral-800 cursor-pointer"
              >
                Đặt ngay
              </Button>
            </Link>
            {/* <Link to="/rooms">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary cursor-pointer"
              >
                Xem phòng
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}
