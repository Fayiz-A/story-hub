import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface Props {
  title: String,
}

class AppBar extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  container: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,    
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    backgroundColor: "purple"
  },
});

export default AppBar;
