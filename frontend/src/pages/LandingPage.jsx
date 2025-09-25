import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Brain,
  Zap,
  Shield,
  Target,
  Clock,
  ChevronRight,
  Menu,
  X,
  LineChart,
} from 'lucide-react';
import { Link } from "react-router-dom";

function LandingPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Order Forecasting",
      description: "Predict future order volumes with 95% accuracy using advanced machine learning algorithms and historical data patterns."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Transaction Analysis",
      description: "Real-time transaction monitoring and analysis to identify trends, anomalies, and optimization opportunities."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User Growth Insights",
      description: "Track user engagement, retention patterns, and growth metrics with AI-powered behavioral analysis."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Recommendations",
      description: "Get intelligent suggestions for inventory management, pricing strategies, and business optimization."
    }
  ];

  const benefits = [
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Efficiency",
      description: "Automate inventory decisions and reduce manual work by up to 80%"
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Accuracy",
      description: "AI-driven predictions with 95%+ accuracy for demand forecasting"
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: "Speed",
      description: "Real-time insights and instant alerts for immediate action"
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Security",
      description: "Enterprise-grade security with end-to-end encryption"
    }
  ];

  const insights = [
    {
      type: 'positive',
      message: "Orders are forecasted to increase by 12% next week – consider increasing stock levels",
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      type: 'negative',
      message: "User growth is slowing down – optimize retention strategies to maintain momentum",
      icon: <Users className="w-5 h-5" />
    },
    {
      type: 'correlation',
      message: "Transaction volume correlates with weekend promotions – schedule more campaigns",
      icon: <BarChart3 className="w-5 h-5" />
    }
  ];

  const chartData = {
    orders: [
      { month: 'Jan', historical: 120, predicted: null, confidence: null },
      { month: 'Feb', historical: 135, predicted: null, confidence: null },
      { month: 'Mar', historical: 158, predicted: null, confidence: null },
      { month: 'Apr', historical: 142, predicted: null, confidence: null },
      { month: 'May', historical: 168, predicted: null, confidence: null },
      { month: 'Jun', historical: null, predicted: 185, confidence: [175, 195] },
      { month: 'Jul', historical: null, predicted: 201, confidence: [188, 214] },
      { month: 'Aug', historical: null, predicted: 218, confidence: [202, 234] }
    ],
    transactions: [
      { month: 'Jan', historical: 85, predicted: null, confidence: null },
      { month: 'Feb', historical: 92, predicted: null, confidence: null },
      { month: 'Mar', historical: 108, predicted: null, confidence: null },
      { month: 'Apr', historical: 98, predicted: null, confidence: null },
      { month: 'May', historical: 115, predicted: null, confidence: null },
      { month: 'Jun', historical: null, predicted: 125, confidence: [118, 132] },
      { month: 'Jul', historical: null, predicted: 138, confidence: [128, 148] },
      { month: 'Aug', historical: null, predicted: 145, confidence: [133, 157] }
    ],
    users: [
      { month: 'Jan', historical: 2400, predicted: null, confidence: null },
      { month: 'Feb', historical: 2650, predicted: null, confidence: null },
      { month: 'Mar', historical: 2890, predicted: null, confidence: null },
      { month: 'Apr', historical: 2720, predicted: null, confidence: null },
      { month: 'May', historical: 3150, predicted: null, confidence: null },
      { month: 'Jun', historical: null, predicted: 3420, confidence: [3200, 3640] },
      { month: 'Jul', historical: null, predicted: 3680, confidence: [3400, 3960] },
      { month: 'Aug', historical: null, predicted: 3950, confidence: [3650, 4250] }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  SmartInventory
                </span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-slate-300 hover:text-emerald-400 transition-colors duration-300">Features</a>
                <a href="#insights" className="text-slate-300 hover:text-emerald-400 transition-colors duration-300">AI Insights</a>
                <a href="#benefits" className="text-slate-300 hover:text-emerald-400 transition-colors duration-300">Benefits</a>
               <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 transform hover:scale-105">
  <Link to="/login">Sign In</Link>
</button>

              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-emerald-400 transition-colors duration-300"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-700/50">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-slate-300 hover:text-emerald-400 transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#insights" className="text-slate-300 hover:text-emerald-400 transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>AI Insights</a>
                <a href="#benefits" className="text-slate-300 hover:text-emerald-400 transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>Benefits</a>
                <button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-2.5 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 w-fit">
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-500"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-emerald-400/5 rounded-full blur-2xl animate-pulse delay-1500"></div>
        </div>

        {/* Grid Pattern Overlay -- CORRECTED */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23064e3b\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered Analytics Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Smart Inventory Management with{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  AI Forecasting
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Track your orders, transactions, and users in real-time with AI-driven insights
                and future predictions to optimize your business decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 group">
                  Get Started
                  <ChevronRight className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button className="bg-slate-800/50 backdrop-blur-sm text-slate-200 px-8 py-4 rounded-xl font-semibold hover:bg-slate-700/50 border border-slate-700/50 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300">
                  View Dashboard
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-700/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">95%</div>
                  <div className="text-sm text-slate-400">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">24/7</div>
                  <div className="text-sm text-slate-400">Monitoring</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">Real-time</div>
                  <div className="text-sm text-slate-400">Insights</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50 hover:shadow-emerald-500/10 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Live Analytics</h3>
                  <div className="flex space-x-2 items-center">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                    <span className="text-sm text-slate-300">Real-time</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-4 rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-100 text-sm">Orders Today</p>
                        <p className="text-2xl font-bold">1,247</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-emerald-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">AI Accuracy</p>
                        <p className="text-2xl font-bold">96.8%</p>
                      </div>
                      <Brain className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>
                </div>

                <div className="h-32 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl relative overflow-hidden border border-slate-600/50">
                  <div className="absolute bottom-0 left-0 w-full h-full flex items-end justify-around p-3">
                    {[40, 65, 45, 80, 60, 95, 75, 85].map((height, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-t from-emerald-500 via-cyan-500 to-blue-500 rounded-t shadow-lg transform hover:scale-110 transition-all duration-300"
                        style={{ width: '8%', height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-emerald-500/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
              <Brain className="w-4 h-4 mr-2" />
              Advanced Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful Features for Modern Businesses
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Leverage cutting-edge AI technology to transform your inventory management
              and make data-driven decisions with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl border border-slate-600/50 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-emerald-500/25">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forecast Visualization Preview */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
              <LineChart className="w-4 h-4 mr-2" />
              Predictive Analytics
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              AI-Powered Forecasting in Action
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              See how our advanced algorithms predict future trends with confidence intervals
              to help you make informed decisions.
            </p>
          </div>

          <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50">
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { key: 'orders', label: 'Orders', icon: <BarChart3 className="w-4 h-4" /> },
                { key: 'transactions', label: 'Transactions', icon: <LineChart className="w-4 h-4" /> },
                { key: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.key
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="h-80 bg-gradient-to-br from-slate-700/30 to-slate-600/30 rounded-xl p-6 relative overflow-hidden border border-slate-600/50">
              <div className="flex justify-between items-end h-full">
                {chartData[activeTab].map((data, index) => {
                  const maxValue = Math.max(
                    ...chartData[activeTab].map(d =>
                      Math.max(d.historical || 0, d.predicted || 0, ...(d.confidence || [0, 0]))
                    )
                  );

                  const historicalHeight = data.historical ? (data.historical / maxValue) * 80 : 0;
                  const predictedHeight = data.predicted ? (data.predicted / maxValue) * 80 : 0;

                  return (
                    <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                      <div className="relative h-48 flex items-end justify-center w-full">
                        {data.historical && (
                          <div
                            className="bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t w-8 shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110"
                            style={{ height: `${historicalHeight}%` }}
                            title={`Historical: ${data.historical}`}
                          ></div>
                        )}
                        {data.predicted && (
                          <div className="relative" title={`Predicted: ${data.predicted}`}>
                            <div
                              className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t w-8 border-2 border-dashed border-blue-300/50 shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-110"
                              style={{ height: `${predictedHeight}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-slate-300 font-medium">{data.month}</span>
                    </div>
                  );
                })}
              </div>

              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-4 text-sm bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-600/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded shadow-lg"></div>
                    <span className="text-slate-300">Historical</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-dashed border-blue-300/50 rounded shadow-lg"></div>
                    <span className="text-slate-300">Predicted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section id="insights" className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <Brain className="w-4 h-4 mr-2" />
              Smart Recommendations
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              AI-Generated Insights
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Get actionable recommendations automatically generated by our AI system
              to stay ahead of trends and optimize your operations.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {insights.map((insight, index) => {
              const colors = {
                positive: 'from-emerald-500/10 to-green-500/10 border-emerald-500/30 text-emerald-100',
                negative: 'from-red-500/10 to-rose-500/10 border-red-500/30 text-red-100',
                correlation: 'from-blue-500/10 to-indigo-500/10 border-blue-500/30 text-blue-100'
              };

              const iconColors = {
                positive: 'text-emerald-400 bg-emerald-500/20',
                negative: 'text-red-400 bg-red-500/20',
                correlation: 'text-blue-400 bg-blue-500/20'
              };

              return (
                <div
                  key={index}
                  className={`p-6 bg-gradient-to-r ${colors[insight.type]} border rounded-xl hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl backdrop-blur-sm ${iconColors[insight.type]} shadow-lg`}>
                      {insight.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium leading-relaxed text-lg">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose SmartInventory?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience the difference with our cutting-edge platform designed
              for modern businesses that demand excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center group p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-emerald-500/25">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 relative overflow-hidden">
        {/* Background Pattern -- CORRECTED */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Ready to Transform Your Business?
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of businesses already using SmartInventory to optimize
            their operations with AI-powered insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
              Start Free Trial
              <ChevronRight className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button className="bg-transparent border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-sm">
              Schedule Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10,000+</div>
              <div className="text-sm text-emerald-100">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-emerald-100">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-emerald-100">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">Enterprise</div>
              <div className="text-sm text-emerald-100">Security</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  SmartInventory
                </span>
              </div>
              <p className="text-slate-400 max-w-md mb-6">
                Empowering businesses with AI-driven inventory management solutions
                for the future of commerce.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center border border-slate-700 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer">
                  <div className="w-5 h-5 bg-slate-400 rounded"></div>
                </div>
                <div className="w-10 h-10 bg-slate-800 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center border border-slate-700 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer">
                  <div className="w-5 h-5 bg-slate-400 rounded"></div>
                </div>
                <div className="w-10 h-10 bg-slate-800 hover:bg-emerald-500/20 rounded-lg flex items-center justify-center border border-slate-700 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer">
                  <div className="w-5 h-5 bg-slate-400 rounded"></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-emerald-400">Product</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Dashboard</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">API Documentation</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Integrations</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-300">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">Company</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">Contact</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors duration-300">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} SmartInventory. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-slate-500 text-sm">Built with</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-400">AI Technology</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;