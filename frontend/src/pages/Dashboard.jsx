import React, { useEffect, useState } from 'react';
import { Line, PolarArea, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Loader, TrendingUp, TrendingDown, AreaChart, BarChart3, PieChart, AlertCircle } from 'lucide-react';
import DashboardHeader from '../components/dashboardheader';

// Register all necessary Chart.js components
Chart.register(...registerables);

const ForecastDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState('monthly');
    const [forecastDays, setForecastDays] = useState(7);
    const [chartTypes, setChartTypes] = useState({
        orders: 'line',
        transactions: 'area',
        users: 'bar'
    });

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/ai/all-forecasts?timeRange=${timeRange}&forecastDays=${forecastDays}`)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(result => {
                setData(result);
                setError(null);
            })
            .catch(err => {
                console.error('Error:', err);
                setError('Failed to load forecast data. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, [timeRange, forecastDays]);

    // Dark-themed chart options
    const getChartOptions = () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: 'rgb(148, 163, 184)' // slate-400
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(30, 41, 59, 0.9)', // slate-800
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(100, 116, 139, 0.5)', // slate-600
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { color: 'rgb(148, 163, 184)', precision: 0 },
                grid: { color: 'rgba(100, 116, 139, 0.2)' } // slate-600 with opacity
            },
            x: {
                ticks: { color: 'rgb(148, 163, 184)' },
                grid: { color: 'rgba(100, 116, 139, 0.2)' }
            }
        }
    });

    const getGrowthIndicator = (metricName) => {
        if (!data?.[metricName]?.forecast?.length) return { trend: "neutral", percentage: "0%" };
        const lastHistorical = data[metricName].historical.slice(-1)[0]?.value || 0;
        const firstForecast = data[metricName].forecast[0]?.value || 0;
        if (lastHistorical === 0 && firstForecast > 0) return { trend: "up", percentage: "∞%" };
        if (lastHistorical === 0) return { trend: "neutral", percentage: "0%" };
        const change = ((firstForecast - lastHistorical) / lastHistorical * 100).toFixed(1);
        return { trend: change > 0 ? "up" : "down", percentage: `${Math.abs(change)}%` };
    };

    const createChartData = (metricName, chartType) => {
        if (!data?.[metricName]?.historical) return { labels: [], datasets: [] };

        const { historical, forecast } = data[metricName];
        const colors = {
            orders: '#34d399',       // emerald-400
            transactions: '#60a5fa', // blue-400
            users: '#facc15'        // amber-400
        };
        const mainColor = colors[metricName];
        
        const allLabels = [...historical.map(item => item.date), ...forecast.map(item => item.date)];

        return {
            labels: allLabels,
            datasets: [
                {
                    label: 'Historical',
                    data: [...historical.map(item => item.value), ...Array(forecast.length).fill(null)],
                    borderColor: mainColor,
                    backgroundColor: chartType === 'area' ? `${mainColor}33` : mainColor,
                    tension: 0.3,
                    fill: chartType === 'area',
                },
                {
                    label: 'Forecast',
                    data: [...Array(historical.length).fill(null), ...forecast.map(item => item.value)],
                    borderColor: mainColor,
                    backgroundColor: `${mainColor}80`,
                    borderDash: [5, 5],
                    tension: 0.3,
                },
                {
                    label: 'Confidence Interval',
                    data: [...Array(historical.length).fill(null), ...forecast.map(item => item.upper)],
                    borderColor: `${mainColor}4D`,
                    backgroundColor: `${mainColor}1A`,
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: '+1', // Fill to the next dataset (lower bound)
                },
                {
                    label: 'Lower Bound', // Hidden label
                    data: [...Array(historical.length).fill(null), ...forecast.map(item => item.lower)],
                    borderColor: `${mainColor}4D`,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false,
                }
            ]
        };
    };

    const renderChart = (metricName, chartType) => {
        const chartData = createChartData(metricName, chartType);
        const options = getChartOptions();

        if (chartType === 'polarArea') return <PolarArea data={chartData} options={options} />;
        if (chartType === 'bar') return <Bar data={chartData} options={options} />;
        return <Line data={chartData} options={options} />;
    };

    const toggleChartType = (metricName) => {
        const sequence = ['line', 'area', 'bar', 'polarArea'];
        const currentIndex = sequence.indexOf(chartTypes[metricName]);
        const nextIndex = (currentIndex + 1) % sequence.length;
        setChartTypes(prev => ({ ...prev, [metricName]: sequence[nextIndex] }));
    };

    const getChartIcon = (currentType) => {
        const iconMap = { line: AreaChart, area: BarChart3, bar: PieChart, polarArea: TrendingUp };
        const Icon = iconMap[currentType] || TrendingUp;
        return <Icon size={14} />;
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-96"><Loader className="animate-spin text-emerald-400" size={48} /></div>;
    }

    if (error) {
        return (
            <div className="bg-red-500/10 text-red-300 p-6 rounded-2xl flex items-center justify-center gap-4">
                <AlertCircle size={32} />
                <div>
                    <h3 className="font-bold">Error Loading Data</h3>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }
    
    if (!data) return null;

    return (
        <div className="space-y-8">
            <DashboardHeader/>

            <header className="text-center">
                <h1 className="text-4xl font-bold text-white">AI Forecast Dashboard</h1>
                <p className="text-lg text-slate-400 mt-2">Predictive analytics for your business metrics</p>
            </header>
            
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-slate-700/50 flex flex-wrap justify-center items-center gap-4">
                <div className="flex rounded-lg bg-slate-700/50 border border-slate-600 overflow-hidden">
                    {['monthly', 'daily'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${timeRange === range ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-600/50'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
                <div className="flex rounded-lg bg-slate-700/50 border border-slate-600 overflow-hidden">
                    {[7, 14, 30].map(days => (
                        <button
                            key={days}
                            onClick={() => setForecastDays(days)}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${forecastDays === days ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-600/50'}`}
                        >
                            {days} Days
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {['orders', 'transactions', 'users'].map(metric => {
                    const growth = getGrowthIndicator(metric);
                    return (
                        <div key={metric} className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-slate-700/50 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white capitalize">{metric} Forecast</h3>
                                    <div className="flex items-center mt-1">
                                        {growth.trend === 'up' ? <TrendingUp size={16} className="text-green-400" /> : <TrendingDown size={16} className="text-red-400" />}
                                        <span className={`ml-1.5 text-sm font-bold ${growth.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                            {growth.percentage}
                                        </span>
                                        <span className="ml-2 text-xs text-slate-400">next {forecastDays} days</span>
                                    </div>
                                </div>
                                <button onClick={() => toggleChartType(metric)} title="Change Chart Type" className="flex items-center bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 px-3 py-1.5 rounded-md text-slate-300 text-xs transition-colors">
                                    {getChartIcon(chartTypes[metric])}
                                </button>
                            </div>
                            <div className="flex-grow h-64">
                                {renderChart(metric, chartTypes[metric])}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ForecastDashboard;
// --- END OF FILE ForecastDashboard.jsx ---