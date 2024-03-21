//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import ItemHome from '../../components/Item/ItemHome';
import {COLORS} from '../../constants/theme';
import ButtonSubmit from '../../components/Button/ButtonSubmit';
import CopyRight from '../../components/CopyRight';

const dataDanhMuc = [
  {
    id: 1,
    path: 'Thực hiện Check list',
    role: 2,
  },
  {
    id: 2,
    path: 'Tra cứu',
    role: 2,
  },
  {
    id: 3,
    path: 'Danh mục Khu vực',
    role: 1,
  },
  {
    id: 4,
    path: 'Danh mục Check list',
    role: 1,
  },
  {
    id: 5,
    path: 'Danh mục Giám sát',
    role: 1,
  },
  {
    id: 6,
    path: 'Danh mục Ca làm việc',
    role: 1,
  },
];
// create a component
const HomeScreen = ({navigation}) => {
  const {user} = useSelector(state => state.authReducer);

  const renderItem = ({item, index}) => (
    <ItemHome roleUser={user?.Permission} item={item} index={index} />
  );
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text
          style={{
            color: 'red',
            fontSize: 16,
          }}>
          Digital Transformation Good day and Happy
        </Text>
        <Text
          style={{
            fontSize: 20,
            color: 'black',
            fontWeight: '700',
            textTransform: 'uppercase',
            paddingTop: 8,
          }}>
          Dự án: {user?.ent_duan?.Duan}
        </Text>
      </View>

      <View
        style={[
          styles.content,
          {
            width: '100%',
            alignContent: 'center',
          },
        ]}>
        <FlatList
          style={{
            width: '80%',
            marginVertical: 20
          }}
          numColumns={2}
          data={dataDanhMuc}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={{height: 20}} />}
          contentContainerStyle={{gap: 20}}
          columnWrapperStyle={{gap: 20}}
        />

        
      </View>
      <View style={{
        flex: 2,
        flexDirection: 'column',
        marginTop: 20,
        marginHorizontal: 20
      }}>
        <Text style={{
            color: 'black',
            fontSize: 15,

        }}>
          Người Giám sát chỉ thực hiện công việc Check list, Tra cứu và Đổi mật
          khẩu.
        </Text>
        <Text 
         style={{
            color: 'black',
            fontSize: 15,

        }}>Giám đốc Tòa nhà toàn quyền sử dụng.</Text>
      </View>

      <CopyRight/>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  content: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
});

//make this component available to the app
export default HomeScreen;
