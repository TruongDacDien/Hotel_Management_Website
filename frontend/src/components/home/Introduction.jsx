import { Star, Award, Gem } from "lucide-react";

export default function Introduction() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Chào mừng tới khách sạn của chúng tôi
            </h2>
            <p className="text-neutral-700 mb-6 leading-relaxed">
              Tọa lạc tại một vị trí lý tưởng, khách sạn mang đến một nơi ẩn dật
              sang trọng và yên tĩnh. Không gian được thiết kế tỉ mỉ, dịch vụ
              được cá nhân hóa và sự chú ý đến từng chi tiết đảm bảo một kỳ nghỉ
              khó quên.
            </p>
            <p className="text-neutral-700 mb-8 leading-relaxed">
              Chúng tôi hiện đang chuẩn bị ra mắt nền tảng trải nghiệm sang
              trọng mới của mình . Hãy tham gia danh sách chờ độc quyền của
              chúng tôi để trở thành một trong những người đầu tiên trải nghiệm
              sự kết hợp độc đáo giữa sự thoải mái và tinh tế của chúng tôi
            </p>
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-amber-300 mr-2" />
                <span className="text-neutral-700">5-Star Service</span>
              </div>
              <div className="flex items-center">
                <Award className="h-5 w-5 text-amber-300 mr-2" />
                <span className="text-neutral-700">Award Winning</span>
              </div>
              <div className="flex items-center">
                <Gem className="h-5 w-5 text-amber-300 mr-2" />
                <span className="text-neutral-700">Luxury Amenities</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-12">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Elegant hotel lobby"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-amber-300 p-4 rounded shadow-lg">
                <p className="text-neutral-800 font-bold">Opening Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
