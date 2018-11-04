import React, { PureComponent } from 'react';
import { connect } from 'dva/mobile';
import { Tip } from '../../../components';
import { StyleSheet, View, ScrollView, RefreshControl, Text, Alert, Image, StatusBar, FlatList, Dimensions, TouchableOpacity } from 'react-native'

class Information extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static navigationOptions = ({ navigation }) => {
    const { state, setParams } = navigation;
    return {
      headerTitle: '详细资料',
    };
  };

  componentDidMount() {
    const { user } = this.props.navigation.state.params;
    this.props.information({ user: user.name })
  }

  componentWillReceiveProps(next) {
    const { contacts, navigation } = this.props;
    if (next.contacts && next.contacts !== contacts) {
      navigation.goBack()
    }
  }

  _removeFriends = ({ username }) => {
    Alert.alert(
      '删除好友？', null,
      [
        { text: '取消', onPress: () => console.log('cancle') },
        { text: '确定', onPress: () => this.props.removeFriends({ username }) },
      ]
    )
  }

  render() {
    const { user } = this.props.navigation.state.params;
    const { info, contacts, loading } = this.props;
    const { navigate } = this.props.navigation;
    const friend = contacts.filter(contact => contact.name == user.name).length > 0

    return (
      <ScrollView style={styles.container} refreshControl={<RefreshControl onRefresh={() => { this.props.information({ user: user.name }) }} refreshing={loading} />}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity onPress={() => { navigate('Center', { user }) }}>
          <View style={styles.header}>
            <View style={styles.inner}>
              <Image source={{ uri: info.avatar_url }} style={styles.avatar} />
              <View style={styles.col}>
                <Text style={[styles.span, styles.name]}>{info.name}</Text>
                <Text style={styles.sub}>昵称: {info.name}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.rowList}>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.textView}>
                <Text style={styles.rowText}>微博</Text>
              </View>
              <View style={styles.spanView}>
                <Text numberOfLines={1} style={styles.span}>{info.weibo ? info.weibo : '未填写'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.textView}>
                <Text style={styles.rowText}>个人网站</Text>
              </View>
              <View style={styles.spanView}>
                <Text numberOfLines={1} style={styles.span}>{info.home ? info.home : '未填写'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.textView}>
                <Text style={styles.rowText}>所在地点</Text>
              </View>
              <View style={styles.spanView}>
                <Text numberOfLines={1} style={styles.span}>{info.location ? info.location : '未填写'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.rowInner}>
              <View style={styles.textView}>
                <Text style={styles.rowText}>个性签名</Text>
              </View>
              <View style={styles.spanView}>
                <Text numberOfLines={1} style={styles.span}>{info.signature ? info.signature : '未填写'}</Text>
              </View>
            </View>
          </View>
        </View>
        {
          friend ?
            <View>
              <TouchableOpacity style={[styles.btn, styles.sendBtn]} onPress={() => { navigate('Chat', { user }) }}>
                <Text style={styles.send}>发送消息</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.delBtn]} onPress={() => { this._removeFriends({ username: user.name }) }}>
                <Text style={[styles.send, { color: '#000' }]}>删除好友</Text>
              </TouchableOpacity>
            </View>
            : <TouchableOpacity style={[styles.btn, styles.addBtn]} onPress={() => { this.props.addFriends({ username: user.name }) }}>
              <Text style={styles.send}>添加好友</Text>
            </TouchableOpacity>
        }
      </ScrollView >
    );
  }
}

function mapStateToProps(state) {
  const { info, loading } = state.zone;
  const { contacts } = state.notice;
  return { info, contacts, loading };
}

function mapDispatchToProps(dispatch) {
  return {
    information(params) {
      dispatch({
        type: 'zone/information',
        payload: params,
      });
    },
    addFriends(params) {
      dispatch({
        type: 'notice/add_friends',
        payload: params,
      });
    },
    removeFriends(params) {
      dispatch({
        type: 'notice/remove_friends',
        payload: params,
      });
    },
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  header: {
    backgroundColor: '#FFFFFF',
  },

  inner: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 15,
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: '#F0F0F0',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },

  sub: {
    paddingTop: 5,
    paddingBottom: 5,
    color: '#999',
    fontSize: 12,
  },

  login: {
    fontSize: 18,
    marginLeft: 15,
  },

  name: {
    color: '#000000',
    fontSize: 16,
  },

  col: {
    flex: 1,
  },

  rowList: {
    marginTop: 10,
  },

  row: {
    paddingLeft: 27,
    paddingRight: 27,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },

  rowImg: {
    width: 20,
    height: 20,
    marginRight: 20,
  },

  rowInner: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: '#F0F0F0',
  },

  textView: {
    flex: 3,
  },

  rowText: {
    fontSize: 16,
    fontWeight: '400',
  },

  spanView: {
    flex: 7,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },

  span: {
    color: '#999',
    fontSize: 14,
  },

  btn: {
    padding: 15,
    margin: 15,
    marginBottom: 0,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#DCDBDC',
    justifyContent: 'center',
  },

  sendBtn: {
    backgroundColor: '#0079FD',
  },

  delBtn: {
    backgroundColor: '#FFFFFF',
  },

  addBtn: {
    backgroundColor: '#19A416',
  },

  send: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Information);
