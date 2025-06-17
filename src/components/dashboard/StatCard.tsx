import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  prefix?: string;
  suffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  trend,
  prefix,
  suffix
}) => {
  return (
    <div className="card hover:border-l-4 hover:border-l-primary-500 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="mt-4 text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">
            {prefix}{value}{suffix}
          </h3>
          
          {(change !== undefined && trend) && (
            <div className="mt-2 flex items-center">
              {trend === 'up' ? (
                <ArrowUp className="h-4 w-3 text-success-500" />
              ) : trend === 'down' ? (
                <ArrowDown className="h-4 w-3 text-danger-500" />
              ) : null}
              
              <span className={`text-[0.61rem] sm:text-sm font-medium ${
                trend === 'up' ? 'text-success-500' : 
                trend === 'down' ? 'text-danger-500' : 
                'text-gray-500 dark:text-gray-400'
              }`}>
                {change}% desde ayer
              </span>
            </div>
          )}
        </div>
        
        <div className="p-1 rounded-md bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mt-[-2px]">
          {icon}
        </div>
      </div>
    </div>
  );
};