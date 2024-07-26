import React, { useState, useEffect, Fragment } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Box,
  LinearProgress,
  Card,
} from "@mui/material";
import {
  fetchMetrics,
  fetchMetricsNames,
  KeyValue,
  Metric,
  PayloadInterface,
} from "./services/cruxApiService";
import MultiSelectDropdown from "./components/MultiSelectDropdown/MultiSelectDropdown";

// @ts-ignore
import _ from 'lodash'

const App: React.FC = () => {
  const [url, setUrl] = useState("");
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metricTypes, setMetricTypes] = useState<KeyValue[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const getKeysFromValues = (objectArray:KeyValue[], valuesArray:string[]) => {
    return valuesArray.map(value => {
        const foundItem = _.find(objectArray, { value: value });
        return foundItem ? foundItem.key : null;
    }).filter(key => key !== null); // Filter out any null values
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const selectedMetricsKeys: string[] = getKeysFromValues(metricTypes, selectedMetrics);

    try {
      const payload: PayloadInterface = {
        url: url,
        metrics: selectedMetricsKeys,
      };
      const fetchedMetrics = await fetchMetrics(payload, metricTypes);
      setMetrics(fetchedMetrics);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMetricObject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const selectedMetricsKeys: string[] = [];

    try {
      const payload: PayloadInterface = {
        url: url,
        metrics: selectedMetricsKeys,
      };
      const fetchedMetrics = await fetchMetricsNames(payload);
      setMetrics([])
      setSelectedMetrics([])
      setMetricTypes(fetchedMetrics);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMetricSelect = (selected: string[]) => {
    setSelectedMetrics(selected);
  };

  const metricNames = metricTypes.map((metric) => metric.value);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        CrUX API Metrics
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter URL"
          variant="outlined"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          margin="normal"
          onBlur={handleMetricObject}
        />
        <MultiSelectDropdown
          metrics={metricNames}
          selectedMetrics={selectedMetrics}
          onSelect={handleMetricSelect}
        />
        <Button type="submit" variant="contained" color="primary">
          Get Metrics
        </Button>
      </form>
      {loading && (
        <Box sx={{ width: "100%", mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {metrics.length > 0 && (
        <Fragment>
          <Alert
            color="info"
            sx={{my:1}}
          >
            Data with no Histograms are hidden
          </Alert>
          <TableContainer component={Card} style={{ marginTop: "20px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Metric</strong></TableCell>
                  <TableCell><strong>Start</strong></TableCell>
                  <TableCell><strong>End</strong></TableCell>
                  <TableCell><strong>Density</strong></TableCell>
                  <TableCell><strong>75th Percentile</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(metrics || []).flatMap((metric) =>
                  metric.histogram.map((bin, index) => (
                    <TableRow key={`${metric.acronym}-${index}`}>
                      <TableCell>{metric.name}</TableCell>
                      <TableCell>{bin.start}</TableCell>
                      <TableCell>{bin.end ?? "-"}</TableCell>
                      <TableCell>{bin.density}</TableCell>
                      <TableCell>{metric.percentiles?.p75 ?? "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Fragment>
      )}
    </Container>
  );
};

export default App;
