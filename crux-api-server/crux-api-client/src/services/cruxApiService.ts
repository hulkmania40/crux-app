import axios from 'axios';

//@ts-ignore
import _ from 'lodash'

const API_URL = 'http://localhost:3001/api/query';

export interface MetricBin {
  start: number;
  end?: number;
  density: number;
}

export interface Metric {
  acronym: string;
  name: string;
  histogram: MetricBin[];
  percentiles?: { p75: number | string };
}

export interface KeyValue {
  key: string;
  value: string;
}

const transformKeys = (obj: Record<string, any>): KeyValue[] => {
  return _.keys(obj).map((key: string) => ({
    key,
    value: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }));
};

export interface PayloadInterface {
  url: string;
  metrics: string[];
}

export async function fetchMetricsNames(payload: PayloadInterface) {
  try {
    const response = await axios.post(API_URL, {
      origin: payload.url
    });
    
    const data = response.data.record.metrics;
    const filteredData = _.pickBy(data, (value: any) => _.has(value, 'histogram'));
    const transformedArray = transformKeys(filteredData);
    return transformedArray;
  } catch (err: any) {
    throw new Error(err.response ? err.response.data.error : 'Error querying the CrUX API');
  }
}

export async function fetchMetrics(payload: PayloadInterface, objectKeys: KeyValue[]): Promise<Metric[]> {
  try {
    const response = await axios.post(API_URL, {
      origin: payload.url,
      metrics: payload.metrics.length ? payload.metrics : []
    });
    
    const data = response.data.record.metrics;
    const formattedMetrics: Metric[] = Object.keys(data).map(key => {
      const metricType = (objectKeys || []).find(objkey => objkey.key === key);
      
      if (data[key]?.histogram) {
        const nameKey = (metricType?.key || "").replace(/_/g, ' ');
        return {
          acronym: metricType ? key.toUpperCase() : "",
          name: metricType ? metricType.value : nameKey.charAt(0).toUpperCase() + nameKey.slice(1),
          histogram: data[key].histogram,
          percentiles: data[key].percentiles
        };
      }
      return null; // Return null for cases where the condition is not met
    }).filter(metric => metric !== null) as Metric[]; // Filter out null values and assert the type      

    return formattedMetrics;
  } catch (err: any) {
    throw new Error(err.response ? err.response.data.error : 'Error querying the CrUX API');
  }
}
