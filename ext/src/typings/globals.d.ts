import { IBreezAdapter } from '@shared/class/wallets/breez-wallet';
import { ISparkAdapter } from '@shared/class/wallets/spark-wallet';

declare function alert(message: string): void;

declare global {
  var breezAdapter: IBreezAdapter;
  var sparkAdapter: ISparkAdapter;
}
