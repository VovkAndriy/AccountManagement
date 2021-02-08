import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import uuid from "react-native-uuid";

export default function InitScreen() {
  const [accountId, setAccountId] = useState(uuid.v4());
  const [amount, setAmount] = useState("");
  const [list, setList] = useState([]);

  const getTransaction = (id) => {
    fetch(`http://localhost:8080/balance/${id}`, {
      headers: {
        account_id: id,
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((response) => response.text())
      .then((response) => {
        if (response === "Account not found.") Alert.alert(response);
        else return JSON.parse(response);
      })
      .then((response) => {
        setList([
          {
            amount: amount,
            account_id: id,
            balance: response.balance,
          },
          ...list,
        ]);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    console.log(list);
    setAccountId(uuid.v4());
    setAmount("");
  }, [list]);

  const onSubmit = () => {
    const body = {
      account_id: accountId,
      amount: parseInt(amount),
    };

    fetch("http://localhost:8080/amount", {
      headers: {
        "Transaction-Id": uuid.v4(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      method: "POST",
    })
      .then((response) => response.text())
      .then((response) => Alert.alert(response))
      .then(() => getTransaction(accountId))
      .catch((e) => {
        if (e.message === "Network request failed") Alert.alert(e.message);
        else console.error(e.message);
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={() => uuid.v4()}
        ListHeaderComponent={
          <>
            <View style={styles.headerContainer}>
              <Text style={styles.text}>Account ID</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setAccountId(text)}
                value={accountId}
              />

              <Text style={styles.text}>Amount</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setAmount(text)}
                value={amount}
              />

              <TouchableOpacity style={styles.btn} onPress={onSubmit}>
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Historical Transactions</Text>
          </>
        }
      />
    </View>
  );
}

const renderItem = ({ item, index }) => {
  return (
    <View style={styles.listItem}>
      {item.amount > 0 ? (
        <Text
          style={styles.listText}
        >{`Transferred ${item.amount}$ to ${item.account_id}`}</Text>
      ) : (
        <Text style={styles.listText}>{`Withdrew ${-item.amount}$ from ${
          item.account_id
        }`}</Text>
      )}
      <View style={{ height: 20 }} />
      <Text
        style={styles.listText}
      >{`Current account balance ${item.balance}$`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
    backgroundColor: "#fff",
  },
  headerContainer: {
    margin: 20,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 20,
    fontFamily: "Kalam_300Light",
  },
  btnText: {
    fontSize: 20,
    fontFamily: "Kalam_700Bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 30,
    paddingHorizontal: 10,
    fontFamily: "Kalam_400Regular",
  },
  btn: {
    paddingVertical: 10,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    textAlign: "center",
    fontFamily: "Kalam_400Regular",
  },
  listItem: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 20,
  },
  listText: {
    fontSize: 16,
    fontFamily: "Kalam_400Regular",
  },
});
