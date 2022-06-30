import React from "react";
import { View, StyleSheet } from 'react-native'; 
import Button from "../Button/Button";

// const pages = (pageCurrent, pageCount) => {
//     let topPages = [];
//     let midPages = [];
//     let botPages = [];

//     for (let i = 1; i <= 3; i++) {
//         if (i < pageCurrent - 3) {
//             topPages.push(i);
//         }
//     }

//     if (pageCount <= 0) midPages = [1];
//     for (let i = pageCurrent - 3; i <= pageCurrent + 3; i++) {
//         if (i > 0 && i <= pageCount) {
//             midPages.push(i);
//         }
//     }

//     for (let i = pageCount; i >= pageCount - 3; i--) {
//         if (i > pageCurrent + 3) {
//             botPages.unshift(i);
//         }
//     }

//     return {
//         topPages,
//         midPages,
//         botPages,
//     };
// };

const Pagination = ({ pagination = {}, onChangePage = () => {},}) => {
    const { pageCurrent, pageCount } = pagination;
    // const { topPages, midPages, botPages } = pages(pageCurrent, pageCount);
    return (
        <View style={styles.container}>
            <View style={styles.mr6}>
                <Button title='Prev' outline={true} disabled={pageCurrent <= 1} onPress={() => onChangePage(pageCurrent - 1)} />
            </View>
            <Button title='Next' outline={true} disabled={pageCurrent >= pageCount} onPress={() => onChangePage(pageCurrent + 1)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mr6: {
        marginRight: 6,
    }
});

export default Pagination;