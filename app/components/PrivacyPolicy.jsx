import React from "react";
import { ScrollView, Text, View, Linking, StyleSheet } from "react-native";

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text allowFontScaling={false} style={styles.h1}>
        Chính Sách Bảo Mật
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Cập nhật lần cuối: 19 tháng 5, 2024
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Chính Sách Bảo Mật này mô tả các chính sách và thủ tục của chúng tôi về
        việc thu thập, sử dụng và tiết lộ thông tin của bạn khi bạn sử dụng Dịch
        Vụ và thông báo cho bạn về quyền riêng tư của bạn và cách thức pháp luật
        bảo vệ bạn.
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Chúng tôi sử dụng Dữ Liệu Cá Nhân của bạn để cung cấp và cải thiện Dịch
        Vụ. Bằng việc sử dụng Dịch Vụ, bạn đồng ý với việc thu thập và sử dụng
        thông tin theo Chính Sách Bảo Mật này. Chính Sách Bảo Mật này đã được
        tạo ra với sự trợ giúp của
        <Text
          allowFontScaling={false}
          style={styles.link}
          onPress={() =>
            Linking.openURL(
              "https://www.termsfeed.com/privacy-policy-generator/"
            )
          }
        >
          {" "}
          Công Cụ Tạo Chính Sách Bảo Mật
        </Text>
        .
      </Text>
      <Text allowFontScaling={false} style={styles.h2}>
        Giải Thích và Định Nghĩa
      </Text>
      <Text allowFontScaling={false} style={styles.h3}>
        Giải Thích
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Các từ có chữ cái đầu tiên viết hoa có nghĩa được định nghĩa theo các
        điều kiện dưới đây. Các định nghĩa dưới đây sẽ có ý nghĩa giống nhau bất
        kể chúng xuất hiện ở dạng số ít hay số nhiều.
      </Text>
      <Text allowFontScaling={false} style={styles.h3}>
        Định Nghĩa
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Vì mục đích của Chính Sách Bảo Mật này:
      </Text>
      <View style={styles.ul}>
        <Text allowFontScaling={false} style={styles.li}>
          <Text allowFontScaling={false} style={styles.strong}>
            Tài Khoản
          </Text>{" "}
          là tài khoản duy nhất được tạo cho bạn để truy cập vào Dịch Vụ của
          chúng tôi hoặc các phần của Dịch Vụ.
        </Text>
        <Text allowFontScaling={false} style={styles.li}>
          <Text allowFontScaling={false} style={styles.strong}>
            Công Ty
          </Text>{" "}
          (được gọi là "Công Ty", "Chúng Tôi", "Chúng Tôi" hoặc "Của Chúng Tôi"
          trong Thỏa Thuận này) chỉ về PMC, 57 Huỳnh Thúc Kháng, Q. Đống Đa.
        </Text>
        <Text allowFontScaling={false} style={styles.li}>
          <Text allowFontScaling={false} style={styles.strong}>
            Quốc Gia
          </Text>{" "}
          chỉ về: Việt Nam.
        </Text>
        <Text allowFontScaling={false} style={styles.li}>
          <Text allowFontScaling={false} style={styles.strong}>
            Thiết Bị
          </Text>{" "}
          là bất kỳ thiết bị nào có thể truy cập vào Dịch Vụ, chẳng hạn như máy
          tính, điện thoại di động hoặc máy tính bảng kỹ thuật số.
        </Text>
        <Text allowFontScaling={false} style={styles.li}>
          <Text allowFontScaling={false} style={styles.strong}>
            Dữ Liệu Cá Nhân
          </Text>{" "}
          là bất kỳ thông tin nào liên quan đến một cá nhân đã được xác định
          hoặc có thể xác định được.
        </Text>
        <Text allowFontScaling={false} style={styles.li}>
          <Text allowFontScaling={false} style={styles.strong}>
            Dịch Vụ
          </Text>{" "}
          chỉ về Ứng Dụng.
        </Text>
      </View>
      <Text allowFontScaling={false} style={styles.h2}>
        Thu Thập và Sử Dụng Dữ Liệu Cá Nhân của Bạn
      </Text>
      <Text allowFontScaling={false} style={styles.h3}>
        Các Loại Dữ Liệu Được Thu Thập
      </Text>
      <Text allowFontScaling={false} style={styles.h4}>
        Dữ Liệu Cá Nhân
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Trong khi sử dụng Dịch Vụ của chúng tôi, chúng tôi có thể yêu cầu bạn
        cung cấp thông tin cá nhân có thể được sử dụng để liên hệ hoặc nhận dạng
        bạn. Thông tin cá nhân có thể bao gồm, nhưng không giới hạn:
      </Text>
      <View style={styles.ul}>
        <Text allowFontScaling={false} style={styles.li}>
          Địa chỉ, Tỉnh/Thành phố, Mã bưu chính, Thành phố
        </Text>
        <Text allowFontScaling={false} style={styles.li}>
          Dữ Liệu Sử Dụng
        </Text>
      </View>
      <Text allowFontScaling={false} style={styles.h4}>
        Dữ Liệu Sử Dụng
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Dữ Liệu Sử Dụng được thu thập tự động khi sử dụng Dịch Vụ.
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Dữ Liệu Sử Dụng có thể bao gồm thông tin như địa chỉ IP của Thiết Bị của
        bạn, loại trình duyệt, phiên bản trình duyệt, các trang của Dịch Vụ mà
        bạn truy cập, thời gian và ngày của chuyến thăm, thời gian bạn dành cho
        các trang đó, các định danh thiết bị duy nhất và các dữ liệu chuẩn đoán
        khác.
      </Text>
      <Text allowFontScaling={false} style={styles.h3}>
        Sử Dụng Dữ Liệu Cá Nhân của Bạn
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Công Ty có thể sử dụng Dữ Liệu Cá Nhân cho các mục đích sau:
      </Text>
      <View style={styles.ul}>
        <Text allowFontScaling={false} style={styles.li}>
          <Text allowFontScaling={false} style={styles.strong}>
            Cung Cấp và Duy Trì Dịch Vụ của chúng tôi
          </Text>
          , bao gồm việc giám sát việc sử dụng dịch vụ của chúng tôi.
        </Text>
        <Text allowFontScaling={false} style={styles.li}>
          <Text allowFontScaling={false} style={styles.strong}>
            Quản lý Tài Khoản của Bạn:
          </Text>{" "}
          để quản lý việc đăng ký của bạn như là người dùng của Dịch Vụ.
        </Text>
      </View>
      <Text allowFontScaling={false} style={styles.h3}>
        Quản Lý Dữ Liệu Cá Nhân của Bạn
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Chúng tôi sẽ lưu trữ và xử lý Dữ Liệu Cá Nhân của bạn chỉ trong khoảng
        thời gian cần thiết để hoàn thành các mục đích đã được mô tả trong Chính
        Sách Bảo Mật này.
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Chúng tôi sẽ giữ lại và sử dụng Dữ Liệu Cá Nhân của bạn trong phạm vi
        cần thiết để tuân thủ các nghĩa vụ pháp lý, giải quyết tranh chấp và
        thực thi các thỏa thuận và chính sách của chúng tôi.
      </Text>
      <Text allowFontScaling={false} style={styles.h3}>
        Chia Sẻ Dữ Liệu Cá Nhân của Bạn
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Chúng tôi có thể chia sẻ Dữ Liệu Cá Nhân của bạn với các bên thứ ba
        trong một số trường hợp sau:
      </Text>
      <View style={styles.ul}>
        <Text allowFontScaling={false} style={styles.li}>
          Để cung cấp dịch vụ của chúng tôi, chúng tôi có thể chia sẻ Dữ Liệu Cá
          Nhân của bạn với các nhà cung cấp dịch vụ hoặc đối tác đáng tin cậy.
        </Text>
        <Text allowFontScaling={false} style={styles.li}>
          Nếu có yêu cầu pháp lý hoặc nghĩa vụ pháp lý phải thực hiện, chúng tôi
          có thể cung cấp Dữ Liệu Cá Nhân của bạn cho các cơ quan chức năng hoặc
          các bên liên quan.
        </Text>
      </View>

      <Text allowFontScaling={false} style={styles.h3}>
        Bảo Vệ Dữ Liệu Cá Nhân của Bạn
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Chúng tôi cam kết bảo vệ Dữ Liệu Cá Nhân của bạn bằng các biện pháp bảo
        mật hợp lý. Tuy nhiên, không có phương thức truyền tải qua internet hay
        phương thức lưu trữ điện tử nào là 100% an toàn. Mặc dù chúng tôi nỗ lực
        hết mình để bảo vệ thông tin cá nhân của bạn, nhưng không thể đảm bảo
        tuyệt đối rằng thông tin của bạn sẽ luôn được bảo vệ.
      </Text>

      <Text allowFontScaling={false} style={styles.h3}>
        Quyền Của Bạn
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Bạn có quyền yêu cầu truy cập, sửa đổi, hoặc xóa Dữ Liệu Cá Nhân mà
        chúng tôi thu thập từ bạn, theo các yêu cầu của pháp luật. Bạn cũng có
        thể yêu cầu hạn chế hoặc phản đối việc xử lý Dữ Liệu Cá Nhân của mình
        trong một số trường hợp nhất định.
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Để thực hiện các quyền của bạn, vui lòng liên hệ với chúng tôi qua thông
        tin liên hệ được cung cấp trong phần cuối của Chính Sách Bảo Mật này.
      </Text>

      <Text allowFontScaling={false} style={styles.h3}>
        Liên Hệ với Chúng Tôi
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Nếu bạn có bất kỳ câu hỏi nào về Chính Sách Bảo Mật này hoặc muốn thực
        hiện các quyền của mình liên quan đến Dữ Liệu Cá Nhân, vui lòng liên hệ
        với chúng tôi theo thông tin sau:
      </Text>
      <View style={styles.ul}>
        <Text allowFontScaling={false} style={styles.li}>
          <Text allowFontScaling={false} style={styles.strong}>
            Công Ty
          </Text>
          : PMC, 57 Huỳnh Thúc Kháng, Q. Đống Đa, Việt Nam
        </Text>
        <Text allowFontScaling={false} style={styles.li}>
          <Text allowFontScaling={false} style={styles.strong}>
            Email
          </Text>
          : support.it@pmcweb.vn
        </Text>
      </View>

      <Text allowFontScaling={false} style={styles.h2}>
        Thay Đổi Chính Sách Bảo Mật
      </Text>
      <Text allowFontScaling={false} style={styles.p}>
        Chúng tôi có thể cập nhật Chính Sách Bảo Mật này theo thời gian để phản
        ánh các thay đổi trong thực tiễn hoặc các yêu cầu pháp lý. Mọi thay đổi
        sẽ được công bố trên trang này với ngày cập nhật mới nhất. Chúng tôi
        khuyến khích bạn thường xuyên kiểm tra Chính Sách Bảo Mật để được cập
        nhật.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  h2: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  h3: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  h4: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  p: {
    fontSize: 16,
    marginVertical: 5,
  },
  ul: {
    marginVertical: 5,
    paddingLeft: 20,
  },
  li: {
    fontSize: 16,
    marginVertical: 5,
  },
  a: {
    color: "blue",
  },
  strong: {
    fontWeight: "bold",
  },
});

export default PrivacyPolicy;
