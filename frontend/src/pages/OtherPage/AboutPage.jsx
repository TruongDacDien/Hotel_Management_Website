import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { HOTEL_INFO } from "../../lib/constants";
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";

export default function AboutPage() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <div className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Về The Loyal Hotel
            </h1>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              Khám phá câu chuyện đằng sau khách sạn sang trọng của chúng tôi, các giá trị của chúng tôi và
              cam kết của chúng tôi trong việc mang đến những trải nghiệm đặc biệt.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">
                Câu Chuyện Của Chúng Tôi
              </h2>
              <p className="text-neutral-700 mb-4">
                Được thành lập vào năm 2010, The Loyal Hotel bắt đầu với tầm nhìn tạo ra một
                khách sạn sang trọng và yên tĩnh. Bắt đầu là một khách sạn boutique
                chỉ có 15 phòng, nơi đây đã phát triển thành một
                điểm đến nổi tiếng thế giới dành cho những du khách sành điệu tìm kiếm sự kết hợp hoàn hảo
                giữa sự thoải mái, thanh lịch và dịch vụ đặc biệt.
              </p>
              <p className="text-neutral-700 mb-4">
                Tên của chúng tôi, "The Loyal", được lấy cảm hứng từ khái niệm sang trọng và cao cấp.
                Tầm nhìn này tiếp tục định hướng cho cách tiếp cận của chúng tôi đối với dịch vụ hiếu khách,
                nơi mọi chi tiết đều được chế tác để tạo ra trải nghiệm siêu việt cho khách hàng của chúng tôi.
              </p>
              <p className="text-neutral-700">
                Ngày nay, The Loyal Hotel là minh chứng cho cam kết không ngừng
                của chúng tôi đối với sự xuất sắc, đã nhận được nhiều lời khen ngợi cho
                sự kết hợp đặc biệt giữa sự sang trọng, dịch vụ được cá nhân hóa và
                các hoạt động bền vững.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1615460549969-36fa19521a4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                alt="Elysian Retreat Exterior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Giá Trị Của Chúng Tôi</h2>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              The Loyal Hotel coi trọng những giá trị cốt lõi định hình
              mọi khía cạnh trong trải nghiệm hiếu khách của chúng tôi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">
                Sự Hiếu Khách Đặc Biệt
              </h3>
              <p className="text-neutral-700">
                Chúng tôi tin vào việc tạo ra những kết nối có ý nghĩa và những trải nghiệm đáng nhớ
                thông qua dịch vụ được cá nhân hóa, dự đoán và vượt qua mong đợi của khách hàng.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m7 10 3 3 7-7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">
                Cam Kết Về Sự Xuất Sắc
              </h3>
              <p className="text-neutral-700">
                Chúng tôi cam kết duy trì các tiêu chuẩn cao nhất trong mọi
                khía cạnh hoạt động của mình, từ chất lượng tiện nghi đến
                tính chuyên nghiệp của đội ngũ nhân viên.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3c.3 0 4.3 6.9 4.3 6.9s7.9 1.1 7.9 1.4c0 .4-6 5-6 5s1.8 7.6 1.4 7.8c-.3.1-6.5-3.1-6.5-3.1S6.7 24 6.5 24c-.3 0 1-7.1 1-7.1s-6.8-5-6.8-5.3 8-1.2 8-1.2S11.7 3 12 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">
                Quản Lý Môi Trường
              </h3>
              <p className="text-neutral-700">
                Chúng tôi cam kết thực hiện các hoạt động bền vững nhằm giảm thiểu
                tác động đến môi trường đồng thời nâng cao vẻ đẹp tự nhiên
                xung quanh chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Đội Ngũ Lãnh Đạo Của Chúng Tôi
            </h2>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              Gặp gỡ những cá nhân đầy nhiệt huyết đang hướng dẫn The Loyal Hotel cam kết hướng đến sự xuất sắc.
            </p>
          </div>
          <div className="flex justify-center items-center space-x-64">
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzaoyffio/image/upload/v1750536063/hotel_management/avatar_Dien.jpg"
                  alt="Developer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Trương Đắc Điền</h3>
              <p className="text-primary font-medium mb-3">Lập Trình Viên</p>
              {/* <p className="text-neutral-700">
                Sophia ensures that our day-to-day operations consistently
                deliver the quality and service our guests expect.
              </p> */}
            </div>
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzaoyffio/image/upload/v1750536063/hotel_management/avatar_Dat.jpg"
                  alt="Developer"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Hoàng Tiến Đạt</h3>
              <p className="text-primary font-medium mb-3">Lập Trình Viên</p>
              {/* <p className="text-neutral-700">
                A culinary master with international experience, Marcus creates
                the exquisite dining experiences Elysian Retreat is known for.
              </p> */}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">
            Trải Nghiệm The Loyal Hotel
          </h2>
          <p className="text-neutral-700 max-w-2xl mx-auto mb-8">
            Chúng tôi mời bạn khám phá sự kết hợp hoàn hảo giữa sự sang trọng, thoải mái và
            dịch vụ đặc biệt qua việc trải nghiệm tại The Loyal Hotel.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/rooms">
              <Button size="lg" variant="outline" className="text-base">
                Khám Phá Phòng Của Chúng Tôi
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-base">
                Liên Hệ Với Chúng Tôi
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
