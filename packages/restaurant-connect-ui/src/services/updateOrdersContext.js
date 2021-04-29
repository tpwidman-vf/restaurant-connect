import { getRows } from './dbApi';
export default function refreshOrders(){
    getRows()
        .then((Items) => {
            return this.setState({ Items });
        });
}