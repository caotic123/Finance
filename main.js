import React, { Component, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, FlatList } from 'react-native';
import { connect } from "react-redux"
import { Icon, Input, Button, Overlay, Divider } from 'react-native-elements'
import { ListItem } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import Bar from "./bar"
import Box from "./box"
import { getBanks, getOperations } from "./actions"
import { client } from './connection';
import SafeArea from 'react-native-safe-area';
import { SafeAreaView } from 'react-native-safe-area-context';

function Home({ user, banks, getBanks, getOperations, operations }) {
  const [bank_selected, constrast_bank] = useState({ visible: false })

  const overdraft = (bank) => bank.operations.reduce((x, y) => {
    const { type, value } = y
    return (value * (type == "outcoming" ? -1 : 1)) + x
  }, 0)

  useFocusEffect(React.useCallback(() => {
    getBanks(user)
    getOperations(user)
  }, []))

  const Status_Bank = () =>
    <View>
      <Text style={{ fontSize: 20, padding: 10 }}>
        {bank_selected.name}
      </Text>
      <Icon
        name="money-check"
        type="font-awesome-5"
        containerStyle={{ padding: 10 }}
      />
      <Text style={{ fontSize: 20, padding: 10, color: "red" }}>
        {bank_selected.overdraft} + ({overdraft(bank_selected)}))
      </Text>
      <View style={{ height: Math.min(bank_selected.operations.length * 50, 500) }}>
        <FlatList
          data={bank_selected.operations}
          renderItem={({ item }) =>
            <View>
              <View key={item.id} style={{ flex: 1, padding: 6, flexDirection: "row", justifyContent: "space-between" }}>
                <Text>
                  {item.description}
                </Text>
                <Text style = {{color : item.type == "outcoming" ? "red" : "green"}}>
                  ({item.type == "outcoming" ? "-" : "+"}{item.value})
              </Text>
              </View>
              <Divider style={{ backgroundColor: 'black' }} />
            </View>}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <Button title={"Okay"} onPress={() => constrast_bank(prev => ({ ...prev, visible: false }))} />

    </View>


  return (
    <View>
      <Bar />
      <View style={{ margin: 10, height: "85%" }}>
        <Text style={{ fontSize: 20, color: "black" }}>
          Seus bancos (clique para ampliar) :
          </Text>
        <Box status={banks} style={{ height: "45%" }} boxing={(list) =>
          <FlatList
            data={list}
            renderItem={({ item }) => {
              const total = item.overdraft + overdraft(item)
              return (<ListItem
                key={item.id}
                title={item.name}
                rightSubtitle={"Total : " + total}
                rightSubtitleStyle={{ color: total > 0 ? "green" : "red" }}
                bottomDivider
                onPress={() => {
                  constrast_bank({ visible: true, ...item })
                }}
                badge={{ value: item.active ? "Ativada" : "Desativada", textStyle: { color: 'white' }, containerStyle: { marginTop: -20 } }}
                chevron />)
            }
            }
            keyExtractor={item => item.id.toString()}
          />} error_msg={"Você não tem nenhuma conta de banco"} />

        <Text style={{ fontSize: 20, color: "black" }}>
          Suas operações :
        </Text>
        <Box style={{ height: "45%" }} status={operations} boxing={(list) => <FlatList
          data={list}
          renderItem={({ item }) =>
            <ListItem
              key={item.id}
              title={item.description}
              subtitle = {item.type.toUpperCase()}
              rightSubtitle = {item.user.created_at}
              subtitleStyle = {{color : item.type == "outcoming" ? "red" : "green"}}
              leftIcon={{ name: "creditcard", type: "antdesign" }}
              badge={{ value: "$" + item.value, badgeStyle : {backgroundColor : item.type == "outcoming" ? "red" : "green"}, textStyle: { color: 'white' }, containerStyle: { marginTop: -20 } }}
              bottomDivider
            />
          }
          keyExtractor={item => item.id.toString()}
        />} error_msg={"Você não tem nenhuma operação"} />

      </View>

      <Overlay onBackdropPress={() => constrast_bank(prev => ({ ...prev, visible: false }))} overlayBackgroundColor="rgba(1, 1, 1, 0.4)" width="auto" height="auto" isVisible={bank_selected.visible}>
        <View>
          {bank_selected.visible ? <Status_Bank /> : null}
        </View>
      </Overlay>
    </View>
  )
}

const mapStateToProps = ({ user, banks, operations }) => ({ user, banks, operations });
const mapDispatchToProps = { getBanks, getOperations };

export default connect(mapStateToProps, mapDispatchToProps)(Home);


