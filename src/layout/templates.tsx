import { html } from "hono/html";
import type { FC } from "hono/jsx";
import type { ResearchType } from "../types";
import { formatManilaTime } from "../utils";

const TopBar: FC = (props) => {
	return (
		<header className="bg-neutral-50 border-b border-neutral-200 shadow-sm sticky top-0 z-10">
			<div className="container mx-auto max-w-4xl px-4">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center">
						<a href="/" className="flex items-center space-x-2 text-xl font-semibold text-primary-700">
							<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
							</svg>
							<span>saliksik.net</span>
						</a>
					</div>
					<div className="flex items-center">
						<div className="flex items-center space-x-2 bg-neutral-100 px-3 py-2 rounded-lg">
							{props.user !== "unknown" ? (
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
										{props.user.charAt(0).toUpperCase()}
									</div>
									<span className="font-medium">{props.user}</span>
								</div>
							) : (
								<div className="flex items-center space-x-2">
									<div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											viewBox="0 0 16 16"
										>
											<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
											<path
												fill-rule="evenodd"
												d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
											/>
										</svg>
									</div>
									<span className="font-medium">Public</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};


const Footer: FC = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-neutral-100 border-t border-neutral-200">
			<div className="container mx-auto max-w-4xl px-4 py-6">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<p className="text-neutral-600 text-sm">
							Copyright © {currentYear} Mark Anthony Llego. All rights reserved.
						</p>
					</div>
					<div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0">
						<div className="flex items-center space-x-4 md:mr-6">
							<a href="/how-it-works" className="text-neutral-600 hover:text-primary-700 transition-colors text-sm">
								How It Works
							</a>
							<a href="/privacy" className="text-neutral-600 hover:text-primary-700 transition-colors text-sm">
								Privacy Policy
							</a>
						</div>
						<div className="flex items-center space-x-4">
							<a href="https://github.com/llegomark" className="text-neutral-600 hover:text-primary-700 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
									<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export const Layout: FC = (props) => {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link href="/styles.css" rel="stylesheet" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />

				{/* Primary Meta Tags */}
				<title>{props.title || "Saliksik - Advanced AI Research Assistant"}</title>
				<meta name="title" content="Saliksik - Advanced AI Research Assistant" />
				<meta name="description" content="An intelligent research assistant powered by Google Gemini 2.0. Conduct comprehensive, in-depth research on any topic with advanced AI assistance." />

				{/* Open Graph / Facebook */}
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://saliksik.net/" />
				<meta property="og:title" content="Saliksik - Advanced AI Research Assistant" />
				<meta property="og:description" content="An intelligent research assistant powered by Google Gemini 2.0. Conduct comprehensive, in-depth research on any topic with advanced AI assistance." />
				<meta property="og:image" content="/social-preview.png" />

				{/* Twitter */}
				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content="https://saliksik.net/" />
				<meta property="twitter:title" content="Saliksik - Advanced AI Research Assistant" />
				<meta property="twitter:description" content="An intelligent research assistant powered by Google Gemini 2.0. Conduct comprehensive, in-depth research on any topic with advanced AI assistance." />
				<meta property="twitter:image" content="/social-preview.png" />

				{/* Favicon */}
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
			</head>
			<body className="bg-neutral-50 min-h-screen flex flex-col">
				<TopBar user={props.user} />
				<main className="flex-grow py-6">
					{props.children}
				</main>
				<Footer />
			</body>
		</html>
	);
};

export const ResearchList: FC = (props) => {
	return (
		<div className="container mx-auto max-w-4xl px-4">
			<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">Public Research Repository</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>All research conducted on saliksik.net is publicly available and visible to all users. Please do not include sensitive or personal information in your research queries.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-amber-800">AI-Generated Content Disclaimer</h3>
						<div className="mt-2 text-sm text-amber-700">
							<p>Our research reports are AI-generated and undergo rigorous quality control, but may occasionally contain errors or inaccuracies. We recommend verifying critical information through multiple trusted sources before making significant decisions based on these reports. Your diligence ensures optimal outcomes.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">
							Community Research Archive
						</h2>
						<div className="flex gap-2">
							<a href="/direct-search" className="btn btn-primary flex items-center space-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-5 h-5"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
								<span>Search</span>
							</a>
							<a href="/create" className="btn btn-success flex items-center space-x-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-5 h-5"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
								<span>Deep Research</span>
							</a>
						</div>
					</div>

					<div className="overflow-x-auto -mx-6">
						<table className="w-full">
							<thead>
								<tr className="border-b border-neutral-200">
									<th className="px-6 py-3 text-left font-medium text-neutral-500 text-sm tracking-wider">Query</th>
									<th className="px-6 py-3 text-left font-medium text-neutral-500 text-sm tracking-wider">Status</th>
									<th className="px-6 py-3 text-left font-medium text-neutral-500 text-sm tracking-wider">Date Created</th>
									<th className="px-6 py-3 text-right font-medium text-neutral-500 text-sm tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-neutral-200">
								{(props.researches.results as ResearchType[]).map((obj) => (
									<tr className="hover:bg-neutral-50 transition-colors duration-150">
										<td className="px-6 py-4">
											<div className="text-sm text-neutral-800 line-clamp-2">{obj.query}</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${obj.status === 1 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}
											>
												{obj.status === 1 ? (
													<>
														<svg className="mr-1.5 h-2 w-2 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
															<circle cx="4" cy="4" r="3" />
														</svg>
														Running
													</>
												) : (
													<>
														<svg className="mr-1.5 h-2 w-2 text-emerald-500" fill="currentColor" viewBox="0 0 8 8">
															<circle cx="4" cy="4" r="3" />
														</svg>
														Complete
													</>
												)}
											</span>
										</td>
										<td className="px-6 py-4">
											<span className="text-sm text-neutral-500 whitespace-nowrap">
												{formatManilaTime(new Date(obj.created_at))}
											</span>
										</td>
										<td className="px-6 py-4 text-right">
											<a
												href={"/details/" + obj.id}
												className="inline-block text-center px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors text-sm font-medium w-full sm:w-auto"
											>
												{obj.status === 1 ? "View" : "Read"}
											</a>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{(props.researches.results as ResearchType[]).length === 0 && (
							<div className="flex flex-col items-center justify-center py-12 px-6">
								<div className="bg-neutral-100 rounded-full p-4 mb-4">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
									</svg>
								</div>
								<h3 className="text-lg font-medium text-neutral-900 mb-1">No researches yet</h3>
								<p className="text-neutral-500 text-center mb-6">Start the first community research by clicking the button above</p>
								<a href="/create" className="btn btn-primary">Create</a>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export const ResearchDetails: FC = (props) => {
	return (
		<div className="container mx-auto max-w-4xl px-4">
			<div className="bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-medium text-neutral-500">
							Research Report
						</h3>
						<div className="flex items-center gap-2">
							<a href="/" className="btn btn-secondary btn-sm flex items-center space-x-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path
										fill-rule="evenodd"
										d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
									/>
								</svg>
								<span>Back</span>
							</a>
						</div>
					</div>

					<div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-amber-700">
									This report was generated by an AI model and should be used with caution. Please independently verify critical information from reliable sources.
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2 mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">{props.research.query}</h2>
						{props.research.direct_search && (
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
								<svg className="mr-1 h-3 w-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
								</svg>
								Search
							</span>
						)}
					</div>

					<div className="space-y-6">
						<div className="border border-neutral-200 rounded-lg overflow-hidden">
							<div className="flex items-center px-4 py-3 bg-neutral-50 border-b border-neutral-200">
								<button className="flex items-center justify-between w-full text-left">
									<span className="font-medium text-neutral-800">Research Parameters</span>
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="6 9 12 15 18 9"></polyline>
									</svg>
								</button>
							</div>

							<div className="p-4 bg-white">
								{props.research.direct_search ? (
									<div className="flex items-center text-neutral-700">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
											<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
										</svg>
										<span>Generated using Google Search Grounding for faster results</span>
									</div>
								) : (
									<table className="w-full text-sm">
										<tbody>
											<tr className="border-b border-neutral-100">
												<th className="py-2 pr-4 font-medium text-neutral-700 text-left">Depth</th>
												<td className="py-2 text-neutral-900">{props.research.depth}</td>
											</tr>
											<tr>
												<th className="py-2 pr-4 font-medium text-neutral-700 text-left">Breadth</th>
												<td className="py-2 text-neutral-900">{props.research.breadth}</td>
											</tr>
										</tbody>
									</table>
								)}
							</div>
						</div>

						{!props.research.direct_search && (
							<div className="border border-neutral-200 rounded-lg overflow-hidden">
								<div className="flex items-center px-4 py-3 bg-neutral-50 border-b border-neutral-200">
									<button className="flex items-center justify-between w-full text-left">
										<span className="font-medium text-neutral-800">Drill-Down Questions</span>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<polyline points="6 9 12 15 18 9"></polyline>
										</svg>
									</button>
								</div>

								<div className="divide-y divide-neutral-100">
									{props.research.questions.map((obj) => (
										<div className="p-4 bg-white">
											<div className="font-medium text-neutral-800 mb-1">{obj.question}</div>
											<div className="text-sm text-neutral-600">{obj.answer}</div>
										</div>
									))}
								</div>
							</div>
						)}

						<div className="border border-neutral-200 rounded-lg overflow-hidden">
							<div className="flex items-center px-4 py-3 bg-neutral-50 border-b border-neutral-200">
								<div className="flex items-center justify-between w-full">
									<span className="font-medium text-neutral-800">Research Report</span>
									{props.research.status === 1 && (
										<div className="flex items-center text-amber-600 text-sm">
											<svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											Processing...
										</div>
									)}
								</div>
							</div>

							<div className="p-6 bg-white">
								<div className="report prose max-w-none">{html(props.research.report_html)}</div>
								{/* Add this script to make all source links open in new tabs */}
								<script dangerouslySetInnerHTML={{
									__html: `
        document.addEventListener('DOMContentLoaded', () => {
            // Target all links under the sources section
            const sourcesHeading = Array.from(document.querySelectorAll('.report h2')).find(h => 
                h.textContent.toLowerCase().includes('sources'));
                
            if (sourcesHeading) {
                // Get all links after the sources heading
                const sourcesList = sourcesHeading.nextElementSibling;
                if (sourcesList && (sourcesList.tagName === 'OL' || sourcesList.tagName === 'UL')) {
                    const links = sourcesList.querySelectorAll('a');
                    links.forEach(link => {
                        link.setAttribute('target', '_blank');
                        link.setAttribute('rel', 'noopener noreferrer');
                    });
                }
            }
        });
    `
								}}></script>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const CreateResearch: FC = (props) => {
	// Extract default values from props or use defaults
	const defaultQuery = props.formData?.query || "";
	const defaultDepth = props.formData?.depth || "5";
	const defaultBreadth = props.formData?.breadth || "5";

	return (
		<div className="container mx-auto max-w-4xl px-4">
			<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">Public Research Notice</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>All research conducted on saliksik.net is publicly available. Please do not include sensitive or personal information in your queries.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">
							Generate Research Report
						</h2>
						<a href="/" className="btn btn-secondary btn-sm flex items-center space-x-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
								/>
							</svg>
							<span>Back</span>
						</a>
					</div>

					<form
						className="space-y-6 max-w-2xl"
						action="/create"
						method="post"
					>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-neutral-700">
								What do you want to research?
							</label>
							<div className="relative">
								<textarea
									id="research-query"
									name="query"
									className="w-full min-h-32 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
									required={true}
									placeholder="Write me a report about..."
									defaultValue={defaultQuery}
								></textarea>
								<div className="group absolute bottom-3 right-3">
									<button
										type="button"
										id="optimize-topic-btn"
										className="bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200 rounded p-2 cursor-pointer"
										aria-label="Optimize my research topic with AI"
									>
										<span id="optimize-icon" className="block">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
											</svg>
										</span>
										<span id="optimize-loading" className="hidden">
											<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										</span>
										<div className="absolute bottom-full right-0 mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
											<div className="bg-neutral-800 text-white text-xs rounded py-1 px-2 shadow-lg">
												Optimize my research topic with AI
											</div>
										</div>
									</button>
								</div>
							</div>
							<div className="flex justify-between">
								<div className="text-xs text-neutral-500 flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
										<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
									</svg>
									<span>Tip: Click the lightning bolt to refine your research topic with AI</span>
								</div>
								<div id="optimization-status" className="text-sm text-neutral-600 hidden mt-2"></div>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2">
								<label className="block text-sm font-medium text-neutral-700">
									Research Depth
								</label>
								<div className="flex items-center">
									<input
										name="depth"
										type="number"
										min="1"
										max="5"
										className="w-20 p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
										defaultValue={defaultDepth || 5}
										placeholder="5"
										required={true}
									/>
									<div className="ml-3 text-sm text-neutral-500">
										<span className="block">1 = Basic research</span>
										<span className="block">5 = Deep, extensive research</span>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<label className="block text-sm font-medium text-neutral-700">
									Research Breadth
								</label>
								<div className="flex items-center">
									<input
										name="breadth"
										type="number"
										min="1"
										max="5"
										className="w-20 p-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
										defaultValue={defaultBreadth || 5}
										placeholder="5"
										required={true}
									/>
									<div className="ml-3 text-sm text-neutral-500">
										<span className="block">1 = Focused, narrow scope</span>
										<span className="block">5 = Wide, exploratory scope</span>
									</div>
								</div>
							</div>
						</div>

						<div className="pt-4">
							<button className="btn btn-primary w-full md:w-auto">
								Continue
							</button>
						</div>
					</form>
				</div>
			</div>

			<script dangerouslySetInnerHTML={{
				__html: `
			document.addEventListener('DOMContentLoaded', () => {
			  const optimizeBtn = document.getElementById('optimize-topic-btn');
			  const textarea = document.getElementById('research-query');
			  const optimizeIcon = document.getElementById('optimize-icon');
			  const loadingIndicator = document.getElementById('optimize-loading');
			  const statusElement = document.getElementById('optimization-status');
			  
			  if (optimizeBtn && textarea) {
				optimizeBtn.addEventListener('click', async () => {
				  const currentText = textarea.value.trim();
				  
				  if (!currentText) {
					statusElement.textContent = 'Please enter a research topic first';
					statusElement.className = 'text-sm text-amber-600 mt-2';
					statusElement.classList.remove('hidden');
					
					setTimeout(() => {
					  statusElement.classList.add('hidden');
					}, 3000);
					return;
				  }
				  
				  // Show loading indicator
				  optimizeIcon.classList.add('hidden');
				  loadingIndicator.classList.remove('hidden');
				  optimizeBtn.disabled = true;
				  
				  statusElement.textContent = 'Optimizing your research topic...';
				  statusElement.className = 'text-sm text-primary-600 mt-2';
				  statusElement.classList.remove('hidden');
				  
				  try {
					const response = await fetch('/api/optimize-topic', {
					  method: 'POST',
					  headers: {
						'Content-Type': 'application/json',
					  },
					  body: JSON.stringify({
						topic: currentText
					  })
					});
					
					if (!response.ok) {
					  throw new Error('Failed to optimize topic');
					}
					
					const data = await response.json();
					
					if (data.optimizedTopic) {
					  textarea.value = data.optimizedTopic;
					  
					  statusElement.innerHTML = '<span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>Research topic optimized successfully</span>';
					  statusElement.className = 'text-sm text-green-600 mt-2';
					  
					  // Highlight the textarea briefly
					  textarea.classList.add('ring-2', 'ring-green-500');
					  setTimeout(() => {
						textarea.classList.remove('ring-2', 'ring-green-500');
					  }, 2000);
					  
					  setTimeout(() => {
						statusElement.classList.add('hidden');
					  }, 5000);
					}
				  } catch (error) {
					console.error('Error optimizing topic:', error);
					
					statusElement.textContent = 'Failed to optimize topic. Please try again.';
					statusElement.className = 'text-sm text-red-600 mt-2';
					
					setTimeout(() => {
					  statusElement.classList.add('hidden');
					}, 4000);
				  } finally {
					// Hide loading indicator
					optimizeIcon.classList.remove('hidden');
					loadingIndicator.classList.add('hidden');
					optimizeBtn.disabled = false;
				  }
				});
			  }
			});
		  `
			}}></script>
		</div>
	);
};

export const NewResearchQuestions: FC = (props) => {
	return (
		<div className="container mx-auto max-w-4xl px-4">
			<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">Public Research Notice</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>All research conducted on saliksik.net is publicly available. Please do not include sensitive or personal information in your answers.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">
							Research Drill-Down Questions
						</h2>
						<a href="/" className="btn btn-secondary btn-sm flex items-center space-x-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
								/>
							</svg>
							<span>Back</span>
						</a>
					</div>

					<div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
						<div className="text-sm font-medium text-primary-800 mb-1">Initial Research Query:</div>
						<p className="text-primary-900">{props.research.query}</p>
					</div>

					<div className="max-w-2xl">
						<div className="mb-6">
							<h3 className="text-lg font-medium text-neutral-800 mb-2">
								To get better results, please answer these follow-up questions:
							</h3>
							<p className="text-neutral-600 text-sm mb-4">
								These questions will help the AI understand your needs better and provide more relevant research.
							</p>
							<button
								type="button"
								id="prefill-all-btn"
								className="text-sm font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 px-3 py-2 rounded-md flex items-center transition-colors cursor-pointer"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
								</svg>
								Generate All Answers with AI
							</button>
							<div id="all-suggestions-status" className="mt-2 text-sm text-neutral-600 hidden">
								<div className="flex items-center">
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Generating AI suggestions...
								</div>
							</div>
						</div>

						<form action="/create/finish" method="post" className="space-y-6" id="research-questions-form">
							<input name="query" value={props.research.query} type="hidden" id="research-query" />
							<input name="breadth" value={props.research.breadth} type="hidden" />
							<input name="depth" value={props.research.depth} type="hidden" />

							{props.questions.map((obj, index) => (
								<div className="space-y-2">
									<label className="block text-sm font-medium text-neutral-700" id={`question-${index}-label`}>
										{index + 1}. {obj}
									</label>
									<input name="question" value={obj} type="hidden" />
									<div className="relative">
										<input
											id={`answer-${index}`}
											name="answer"
											className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
											required
											placeholder="Your answer..."
										/>
										<button
											type="button"
											className="suggest-btn bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200 absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-sm flex items-center cursor-pointer"
											data-index={index}
										>
											<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
												<path fill-rule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clip-rule="evenodd" />
												<path fill-rule="evenodd" d="M5 11a5 5 0 1110 0 5 5 0 01-10 0zm5-3a3 3 0 100 6 3 3 0 000-6z" clip-rule="evenodd" />
											</svg>
											<span>AI Suggest</span>
											<span className="loading-indicator hidden ml-1">
												<svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
												</svg>
											</span>
										</button>
									</div>
									<div className="suggestion-status text-xs text-neutral-500 hidden">
										<span className="flex items-center text-green-600">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
												<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
											</svg>
											AI-generated answer applied
										</span>
									</div>
								</div>
							))}

							<div className="pt-2">
								<button className="btn btn-primary w-full md:w-auto">
									Generate
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<script dangerouslySetInnerHTML={{
				__html: `
					document.addEventListener('DOMContentLoaded', () => {
						const form = document.getElementById('research-questions-form');
						const researchQuery = document.getElementById('research-query').value;
						const suggestAllBtn = document.getElementById('prefill-all-btn');
						const allSuggestionsStatus = document.getElementById('all-suggestions-status');
						
						// Function to fetch AI suggestion for a single question
						async function getAISuggestion(question) {
							try {
								const response = await fetch('/api/suggest-answer', {
									method: 'POST',
									headers: {
										'Content-Type': 'application/json',
									},
									body: JSON.stringify({
										question: question,
										query: researchQuery
									}),
								});
								
								if (!response.ok) {
									throw new Error('Failed to get suggestion');
								}
								
								const data = await response.json();
								return data.answer;
							} catch (error) {
								console.error('Error getting suggestion:', error);
								return null;
							}
						}
						
						// Handle individual suggestion buttons
						document.querySelectorAll('.suggest-btn').forEach(button => {
							button.addEventListener('click', async function() {
								// Get elements
								const index = this.getAttribute('data-index');
								const questionElement = document.getElementById(\`question-\${index}-label\`);
								const inputElement = document.getElementById(\`answer-\${index}\`);
								const loadingIndicator = this.querySelector('.loading-indicator');
								const statusElement = this.closest('.space-y-2').querySelector('.suggestion-status');
								
								if (!questionElement || !inputElement) return;
								
								// Get question text (remove the number prefix)
								const questionText = questionElement.textContent.trim();
								const questionWithoutNumber = questionText.substring(questionText.indexOf('. ') + 2);
								
								// Show loading state
								this.disabled = true;
								loadingIndicator.classList.remove('hidden');
								
								// Get AI suggestion
								const suggestion = await getAISuggestion(questionWithoutNumber);
								
								// Update UI
								if (suggestion) {
									inputElement.value = suggestion;
									statusElement.classList.remove('hidden');
								}
								
								// Reset button state
								this.disabled = false;
								loadingIndicator.classList.add('hidden');
							});
						});
						
						// Handle suggest all button
						if (suggestAllBtn) {
							suggestAllBtn.addEventListener('click', async function() {
								// Show loading state
								this.disabled = true;
								allSuggestionsStatus.classList.remove('hidden');
								
								// Get all question elements
								const questionElements = document.querySelectorAll('[id^="question-"][id$="-label"]');
								
								// Process each question sequentially
								for (let i = 0; i < questionElements.length; i++) {
									const questionElement = questionElements[i];
									const index = questionElement.id.replace('question-', '').replace('-label', '');
									const inputElement = document.getElementById(\`answer-\${index}\`);
									const statusElement = inputElement.closest('.space-y-2').querySelector('.suggestion-status');
									
									// Get question text (remove the number prefix)
									const questionText = questionElement.textContent.trim();
									const questionWithoutNumber = questionText.substring(questionText.indexOf('. ') + 2);
									
									// Get AI suggestion
									const suggestion = await getAISuggestion(questionWithoutNumber);
									
									// Update UI
									if (suggestion) {
										inputElement.value = suggestion;
										statusElement.classList.remove('hidden');
									}
								}
								
								// Reset button state
								this.disabled = false;
								allSuggestionsStatus.innerHTML = '<span class="flex items-center text-green-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>All answers generated</span>';
							});
						}
					});
				`
			}}></script>
		</div>
	);
};

export const DirectSearch: FC = (props) => {
	// Extract default value from props or use default
	const defaultQuery = props.formData?.query || "";

	return (
		<div className="container mx-auto max-w-4xl px-4">
			<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg shadow-sm">
				<div className="flex">
					<div className="flex-shrink-0">
						<svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
						</svg>
					</div>
					<div className="ml-3">
						<h3 className="text-sm font-medium text-blue-800">Public Research Notice</h3>
						<div className="mt-2 text-sm text-blue-700">
							<p>All research conducted on saliksik.net is publicly available. Please do not include sensitive or personal information in your queries.</p>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white shadow-md rounded-xl overflow-hidden">
				<div className="p-6 md:p-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-bold text-neutral-900">
							Instant Research with Google Search
						</h2>
						<a href="/" className="btn btn-secondary btn-sm flex items-center space-x-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								fill="currentColor"
								viewBox="0 0 16 16"
							>
								<path
									fill-rule="evenodd"
									d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
								/>
							</svg>
							<span>Back</span>
						</a>
					</div>

					<div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
							</div>
							<div className="ml-3">
								<h3 className="text-sm font-medium text-amber-800">New Feature: Direct Research</h3>
								<div className="mt-2 text-sm text-amber-700">
									<p>This feature uses Google Search Grounding to generate research reports directly. It delivers results more quickly than deep research while providing solid, reliable sources that are vetted through Google's extensive index.</p>
								</div>
							</div>
						</div>
					</div>

					<form
						className="space-y-6 max-w-2xl"
						action="/direct-search/create"
						method="post"
					>
						<div className="space-y-2">
							<label className="block text-sm font-medium text-neutral-700">
								What do you want to research?
							</label>
							<div className="relative">
								<textarea
									id="research-query"
									name="query"
									className="w-full min-h-32 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
									required={true}
									placeholder="Write me a report about..."
									defaultValue={defaultQuery}
								></textarea>
								<div className="group absolute bottom-3 right-3">
									<button
										type="button"
										id="optimize-topic-btn"
										className="bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-200 rounded p-2 cursor-pointer"
										aria-label="Optimize my research topic with AI"
									>
										<span id="optimize-icon" className="block">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
											</svg>
										</span>
										<span id="optimize-loading" className="hidden">
											<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
										</span>
										<div className="absolute bottom-full right-0 mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
											<div className="bg-neutral-800 text-white text-xs rounded py-1 px-2 shadow-lg">
												Optimize my research topic with AI
											</div>
										</div>
									</button>
								</div>
							</div>
							<div className="flex justify-between">
								<div className="text-xs text-neutral-500 flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
										<path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
									</svg>
									<span>Tip: Click the lightning bolt to refine your research topic with AI</span>
								</div>
								<div id="optimization-status" className="text-sm text-neutral-600 hidden mt-2"></div>
							</div>
						</div>

						<div className="pt-4">
							<button className="btn btn-primary w-full md:w-auto">
								<div className="flex items-center">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
									</svg>
									Search
								</div>
							</button>
						</div>
					</form>
				</div>
			</div>

			<script dangerouslySetInnerHTML={{
				__html: `
			document.addEventListener('DOMContentLoaded', () => {
			  const optimizeBtn = document.getElementById('optimize-topic-btn');
			  const textarea = document.getElementById('research-query');
			  const optimizeIcon = document.getElementById('optimize-icon');
			  const loadingIndicator = document.getElementById('optimize-loading');
			  const statusElement = document.getElementById('optimization-status');
			  
			  if (optimizeBtn && textarea) {
				optimizeBtn.addEventListener('click', async () => {
				  const currentText = textarea.value.trim();
				  
				  if (!currentText) {
					statusElement.textContent = 'Please enter a research topic first';
					statusElement.className = 'text-sm text-amber-600 mt-2';
					statusElement.classList.remove('hidden');
					
					setTimeout(() => {
					  statusElement.classList.add('hidden');
					}, 3000);
					return;
				  }
				  
				  // Show loading indicator
				  optimizeIcon.classList.add('hidden');
				  loadingIndicator.classList.remove('hidden');
				  optimizeBtn.disabled = true;
				  
				  statusElement.textContent = 'Optimizing your research topic...';
				  statusElement.className = 'text-sm text-primary-600 mt-2';
				  statusElement.classList.remove('hidden');
				  
				  try {
					const response = await fetch('/api/optimize-topic', {
					  method: 'POST',
					  headers: {
						'Content-Type': 'application/json',
					  },
					  body: JSON.stringify({
						topic: currentText
					  })
					});
					
					if (!response.ok) {
					  throw new Error('Failed to optimize topic');
					}
					
					const data = await response.json();
					
					if (data.optimizedTopic) {
					  textarea.value = data.optimizedTopic;
					  
					  statusElement.innerHTML = '<span class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>Research topic optimized successfully</span>';
					  statusElement.className = 'text-sm text-green-600 mt-2';
					  
					  // Highlight the textarea briefly
					  textarea.classList.add('ring-2', 'ring-green-500');
					  setTimeout(() => {
						textarea.classList.remove('ring-2', 'ring-green-500');
					  }, 2000);
					  
					  setTimeout(() => {
						statusElement.classList.add('hidden');
					  }, 5000);
					}
				  } catch (error) {
					console.error('Error optimizing topic:', error);
					
					statusElement.textContent = 'Failed to optimize topic. Please try again.';
					statusElement.className = 'text-sm text-red-600 mt-2';
					
					setTimeout(() => {
					  statusElement.classList.add('hidden');
					}, 4000);
				  } finally {
					// Hide loading indicator
					optimizeIcon.classList.remove('hidden');
					loadingIndicator.classList.add('hidden');
					optimizeBtn.disabled = false;
				  }
				});
			  }
			});
		  `
			}}></script>
		</div>
	);
};

export const PrivacyPolicy: FC = (props) => {
	return (
		<Layout user={props.user}>
			<div className="container mx-auto max-w-4xl px-4">
				<div className="bg-white shadow-md rounded-xl overflow-hidden">
					<div className="p-6 md:p-8">
						<div className="flex items-center justify-between mb-6">
							<h1 className="text-3xl font-bold text-neutral-900">Privacy Policy</h1>
							<a href="/" className="btn btn-secondary btn-sm flex items-center space-x-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path
										fillRule="evenodd"
										d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
									/>
								</svg>
								<span>Back</span>
							</a>
						</div>

						<div className="space-y-6 text-neutral-700">
							<p className="text-sm">Last Updated: March 17, 2025</p>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">1. Introduction</h2>
								<p>
									Welcome to Saliksik ("we", "our", or "us"). We respect your privacy and are committed to protecting your personal data.
									This privacy policy will inform you about how we handle your personal data when you visit our website and inform you about your privacy rights and how the law protects you.
								</p>
								<p>
									This privacy policy applies to all users of our AI-powered research platform. Please read this privacy policy carefully to understand our practices regarding your personal data.
								</p>
								<p>
									This Privacy Policy is compliant with Republic Act No. 10173, also known as the Data Privacy Act of 2012, and its Implementing Rules and Regulations.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">2. Data We Collect</h2>
								<p>
									We may collect, use, store, and transfer different kinds of personal data about you which we have grouped as follows:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li><strong>Identity Data</strong> includes username or similar identifier.</li>
									<li><strong>Contact Data</strong> includes email address.</li>
									<li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access our website.</li>
									<li><strong>Usage Data</strong> includes information about how you use our website and services, including your search queries and research topics.</li>
									<li><strong>Research Data</strong> includes all information related to your research queries, results, and any data generated during the research process.</li>
								</ul>
								<p>
									We do not normally collect sensitive personal information as defined under the Data Privacy Act, such as information about your race, ethnic origin, marital status, religious, philosophical or political affiliations, health, sexual life, or criminal record unless you voluntarily provide this information as part of your research queries.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">3. How We Collect Your Data</h2>
								<p>
									We use different methods to collect data from and about you including through:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<strong>Direct interactions.</strong> You may provide us with your Identity and Contact Data by filling in forms or by corresponding with us.
									</li>
									<li>
										<strong>Automated technologies or interactions.</strong> As you interact with our website, we may automatically collect Technical Data about your equipment, browsing actions, and patterns.
									</li>
									<li>
										<strong>Research requests.</strong> When you use our AI research platform, we collect and process the queries you submit and the results that are generated.
									</li>
								</ul>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">4. How We Use Your Data</h2>
								<p>
									We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>To provide you with our AI research services</li>
									<li>To improve our website and services</li>
									<li>To respond to your inquiries or requests</li>
									<li>To comply with legal obligations</li>
									<li>To generate aggregate, non-identifying analytics about how our services are used</li>
									<li>For historical, statistical, or scientific purposes</li>
								</ul>
								<p>
									All research conducted on Saliksik is publicly available and visible to all users. Please do not include sensitive or personal information in your research queries.
								</p>
								<p>
									In accordance with the Data Privacy Act, we process personal information fairly and lawfully, ensuring it is accurate, relevant, and not excessive in relation to the purposes for which it is collected and processed.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">5. Criteria for Lawful Processing</h2>
								<p>
									The processing of your personal information is permitted under the following conditions:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>When you have given your consent to such processing</li>
									<li>When processing is necessary to fulfill our contractual obligations to you</li>
									<li>When processing is necessary to comply with our legal obligations</li>
									<li>When processing is necessary to protect your vital interests</li>
									<li>When processing is necessary for the purposes of our legitimate interests or those of a third party to whom the data is disclosed, except where such interests are overridden by your fundamental rights and freedoms</li>
								</ul>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">6. Data Sharing and Third Parties</h2>
								<p>
									We may share your personal data with the following third parties:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<strong>Service providers</strong> who provide IT, system administration, and platform services, including:
										<ul className="list-disc pl-6 mt-2">
											<li>Cloudflare (hosting and infrastructure)</li>
											<li>Google (AI services through Gemini API)</li>
										</ul>
									</li>
									<li>
										<strong>Legal authorities</strong> when we are legally required to do so.
									</li>
								</ul>
								<p>
									When we share your information with third parties, we ensure proper safeguards are in place to protect the confidentiality of your personal information and prevent its use for unauthorized purposes, in compliance with the Data Privacy Act.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">7. Data Security</h2>
								<p>
									We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
									In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
								</p>
								<p>
									Our security measures include:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Safeguards to protect our computer networks against unauthorized access</li>
									<li>A comprehensive security policy for processing personal information</li>
									<li>Regular vulnerability assessments and security monitoring</li>
									<li>Employee training on data privacy and security protocols</li>
								</ul>
								<p>
									However, please note that the transmission of information via the internet is not completely secure. Although we will do our best to protect your personal data, we cannot guarantee the security of your data transmitted to our website; any transmission is at your own risk.
								</p>
								<p>
									In case of a security breach involving your personal information, we will promptly notify the National Privacy Commission and affected data subjects when sensitive personal information or other information that may enable identity fraud has been acquired by an unauthorized person, and there is a real risk of serious harm to any affected data subject.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">8. Data Retention</h2>
								<p>
									We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
								</p>
								<p>
									Research queries and results are stored indefinitely as part of our public research repository unless specifically requested for deletion.
								</p>
								<p>
									Personal information will be disposed of securely when it is no longer needed for the purposes for which it was collected, or when retention is no longer necessary for legal or business purposes.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">9. Your Rights as a Data Subject</h2>
								<p>
									Under the Data Privacy Act, you have the following rights in relation to your personal data:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li><strong>Right to be informed</strong> - You have the right to be informed whether personal information pertaining to you is being or has been processed</li>
									<li><strong>Right to access</strong> - You have the right to reasonable access to your personal information</li>
									<li><strong>Right to rectification</strong> - You have the right to dispute the inaccuracy or error in your personal information and have us correct it immediately</li>
									<li><strong>Right to erasure or blocking</strong> - You have the right to suspend, withdraw, or order the blocking, removal, or destruction of your personal information from our filing system</li>
									<li><strong>Right to damages</strong> - You have the right to be indemnified for damages sustained due to inaccurate, incomplete, outdated, false, unlawfully obtained, or unauthorized use of your personal information</li>
									<li><strong>Right to data portability</strong> - Where your personal information is processed by electronic means, you have the right to obtain a copy of your data in an electronic or structured format</li>
									<li><strong>Right to lodge a complaint</strong> - You have the right to lodge a complaint before the National Privacy Commission</li>
									<li><strong>Right to object</strong> - You have the right to object to the processing of your personal information</li>
								</ul>
								<p>
									To exercise your rights or if you have any questions about your personal information, please contact our Data Protection Officer using the details provided in the "Contact Us" section.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">10. Cookies</h2>
								<p>
									We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
								</p>
								<p>
									You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">11. Children's Privacy</h2>
								<p>
									Our service is not intended for use by children under the age of 16 without parental consent. We do not knowingly collect personally identifiable information from children under 16.
								</p>
								<p>
									If we discover that a child under 16 has provided us with personal information, we will delete such information from our servers immediately.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">12. Data Protection Officer</h2>
								<p>
									We have designated a Data Protection Officer (DPO) who is accountable for ensuring our organization's compliance with the Data Privacy Act. The DPO is responsible for:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>Monitoring our compliance with the Data Privacy Act</li>
									<li>Ensuring that appropriate safeguards are in place for the protection of your personal information</li>
									<li>Handling inquiries and complaints related to data privacy</li>
									<li>Facilitating the exercise of your rights as a data subject</li>
								</ul>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">13. Changes to the Privacy Policy</h2>
								<p>
									We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
								</p>
								<p>
									You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">14. Contact Us</h2>
								<p>
									If you have any questions about this Privacy Policy, or to exercise any of your rights as a data subject, please contact us:
								</p>
								<ul className="list-disc pl-6 space-y-2">
									<li>By email: markllego@gmail.com</li>
									<li>On Twitter/X: <a href="https://x.com/markllego" className="text-primary-600 hover:text-primary-700">@markllego</a></li>
									<li>Website: <a href="https://saliksik.net" className="text-primary-600 hover:text-primary-700">saliksik.net</a></li>
								</ul>
							</section>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export const HowItWorks: FC = (props) => {
	return (
		<Layout user={props.user}>
			<div className="container mx-auto max-w-4xl px-4">
				<div className="bg-white shadow-md rounded-xl overflow-hidden">
					<div className="p-6 md:p-8">
						<div className="flex items-center justify-between mb-6">
							<h1 className="text-3xl font-bold text-neutral-900">How It Works</h1>
							<a href="/" className="btn btn-secondary btn-sm flex items-center space-x-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
								>
									<path
										fill-rule="evenodd"
										d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
									/>
								</svg>
								<span>Back</span>
							</a>
						</div>

						<div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg shadow-sm">
							<div className="flex">
								<div className="flex-shrink-0">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
									</svg>
								</div>
								<div className="ml-3">
									<h3 className="text-sm font-medium text-green-800">Enhanced Research Engine</h3>
									<div className="mt-2 text-sm text-green-700">
										<p>We've upgraded our Deep Research process! It now combines traditional web crawling with Google Search Grounding in parallel, providing more comprehensive and diverse research results.</p>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-8 text-neutral-700">
							<section className="space-y-4">
								<h2 className="text-2xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Overview</h2>
								<p>
									Saliksik is an advanced AI-powered research platform that leverages cutting-edge technology to conduct in-depth research on virtually any topic. The platform offers two research approaches: Enhanced Deep Research and Direct Search, each with its own strengths and use cases.
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
									<div className="bg-gradient-to-b from-primary-50 to-white border border-primary-100 rounded-lg p-5">
										<div className="flex items-center mb-3">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-700 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
											</svg>
											<h3 className="text-lg font-medium text-primary-900">Enhanced Deep Research</h3>
										</div>
										<p className="text-sm text-neutral-700">Our comprehensive research method now combines traditional web scraping with Google Search Grounding in parallel to generate exceptionally thorough reports. This approach takes 5-10 minutes but delivers extensive, in-depth reports with diverse sources and contextual analysis from multiple research methods.</p>
									</div>
									<div className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-lg p-5">
										<div className="flex items-center mb-3">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
											</svg>
											<h3 className="text-lg font-medium text-blue-900">Direct Search</h3>
										</div>
										<p className="text-sm text-neutral-700">Our rapid research method uses Google's Search Grounding to deliver results in seconds rather than minutes. While not as comprehensive as Enhanced Deep Research, it provides quick insights with reliable source attribution for time-sensitive inquiries.</p>
									</div>
								</div>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Technology Stack</h2>
								<p>
									Saliksik is built on a modern, serverless architecture that leverages the latest advancements in cloud computing and artificial intelligence. Here's an overview of the core technologies powering our platform:
								</p>

								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
									<div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex items-center mb-3">
											<div className="bg-neutral-100 p-2 rounded-full mr-3">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
												</svg>
											</div>
											<h3 className="font-medium text-neutral-900">Cloudflare Workers</h3>
										</div>
										<p className="text-sm text-neutral-600">Our serverless runtime environment, providing global distribution, high availability, and exceptional performance.</p>
									</div>

									<div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex items-center mb-3">
											<div className="bg-neutral-100 p-2 rounded-full mr-3">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
												</svg>
											</div>
											<h3 className="font-medium text-neutral-900">Cloudflare Workflows</h3>
										</div>
										<p className="text-sm text-neutral-600">Manages the research process, ensuring reliable execution and persistence of complex, multi-step research tasks.</p>
									</div>

									<div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex items-center mb-3">
											<div className="bg-neutral-100 p-2 rounded-full mr-3">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
												</svg>
											</div>
											<h3 className="font-medium text-neutral-900">Cloudflare D1</h3>
										</div>
										<p className="text-sm text-neutral-600">Serverless SQL database to store research data, status, and results with distributed reliability.</p>
									</div>

									<div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex items-center mb-3">
											<div className="bg-neutral-100 p-2 rounded-full mr-3">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
												</svg>
											</div>
											<h3 className="font-medium text-neutral-900">Google Gemini 2.0</h3>
										</div>
										<p className="text-sm text-neutral-600">Cutting-edge AI language model that powers our research capabilities, providing advanced reasoning and analysis.</p>
									</div>

									<div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex items-center mb-3">
											<div className="bg-neutral-100 p-2 rounded-full mr-3">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
											</div>
											<h3 className="font-medium text-neutral-900">Browser Rendering</h3>
										</div>
										<p className="text-sm text-neutral-600">For Deep Research, our platform uses Cloudflare's browser rendering service to gather information from the web.</p>
									</div>

									<div className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
										<div className="flex items-center mb-3">
											<div className="bg-neutral-100 p-2 rounded-full mr-3">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
												</svg>
											</div>
											<h3 className="font-medium text-neutral-900">Hono Framework</h3>
										</div>
										<p className="text-sm text-neutral-600">Lightweight web framework used for building the dashboard and API endpoints with JSX support.</p>
									</div>
								</div>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">How the Research Process Works</h2>

								<div className="space-y-6">
									<div>
										<h3 className="text-xl font-medium text-neutral-900 mb-3">Enhanced Deep Research Process</h3>
										<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
											<div className="flex items-center">
												<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
													<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
												</svg>
												<div className="text-sm font-medium text-yellow-800">New Feature: Parallel Research</div>
											</div>
											<p className="text-sm text-yellow-700 mt-1">
												Our Enhanced Deep Research now runs two parallel research processes: traditional web crawling via DuckDuckGo and Google Search Grounding. This dual approach creates more comprehensive, diverse reports by combining insights from both methods.
											</p>
										</div>
										<ol className="border-l border-primary-200 ml-3 space-y-6 pt-2">
											<li className="relative pl-8 pb-2">
												<div className="absolute -left-3 top-0 bg-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">1</div>
												<h4 className="text-lg font-medium text-neutral-800">Query Input & Refinement</h4>
												<p className="text-sm text-neutral-600 mt-1">When you submit a research query, our system generates targeted follow-up questions to better understand your research needs. Your answers help focus the research direction.</p>
											</li>
											<li className="relative pl-8 pb-2">
												<div className="absolute -left-3 top-0 bg-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">2</div>
												<h4 className="text-lg font-medium text-neutral-800">Parallel Research Processes</h4>
												<p className="text-sm text-neutral-600 mt-1">The system simultaneously launches two research processes:</p>
												<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
													<div className="bg-primary-50 rounded-lg p-3 border border-primary-100">
														<h5 className="text-sm font-medium text-primary-800 mb-1">Web Crawling Research</h5>
														<p className="text-xs text-primary-700">Searches DuckDuckGo, visits real webpages, extracts content, and analyzes it in depth using Gemini 2.0.</p>
													</div>
													<div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
														<h5 className="text-sm font-medium text-blue-800 mb-1">Search Grounding</h5>
														<p className="text-xs text-blue-700">Leverages Google's Search Grounding via Gemini 2.0 to access current information directly from Google Search.</p>
													</div>
												</div>
											</li>
											<li className="relative pl-8 pb-2">
												<div className="absolute -left-3 top-0 bg-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">3</div>
												<h4 className="text-lg font-medium text-neutral-800">Web Exploration</h4>
												<p className="text-sm text-neutral-600 mt-1">For the web crawling process, the system searches DuckDuckGo and visits multiple webpages to gather information. Content is extracted and processed from each page visited.</p>
											</li>
											<li className="relative pl-8 pb-2">
												<div className="absolute -left-3 top-0 bg-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">4</div>
												<h4 className="text-lg font-medium text-neutral-800">Iterative Research</h4>
												<p className="text-sm text-neutral-600 mt-1">Based on initial findings, the web crawling process identifies knowledge gaps and generates additional search queries. This iterative process continues based on your specified research depth.</p>
											</li>
											<li className="relative pl-8 pb-2">
												<div className="absolute -left-3 top-0 bg-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">5</div>
												<h4 className="text-lg font-medium text-neutral-800">Results Combination</h4>
												<p className="text-sm text-neutral-600 mt-1">When both processes complete, the system combines and deduplicates the learnings and sources from both approaches, creating a comprehensive pool of information that leverages both research methods.</p>
											</li>
											<li className="relative pl-8 pb-2">
												<div className="absolute -left-3 top-0 bg-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">6</div>
												<h4 className="text-lg font-medium text-neutral-800">Analysis & Synthesis</h4>
												<p className="text-sm text-neutral-600 mt-1">Gemini 2.0 analyzes all collected information from both processes, identifies patterns and relationships, evaluates the reliability of sources, and synthesizes the findings into a cohesive whole.</p>
											</li>
											<li className="relative pl-8">
												<div className="absolute -left-3 top-0 bg-primary-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">7</div>
												<h4 className="text-lg font-medium text-neutral-800">Report Generation</h4>
												<p className="text-sm text-neutral-600 mt-1">The system generates a comprehensive, well-structured report with proper citations, an executive summary, background information, main analysis, and conclusions based on the combined data from both research methods.</p>
											</li>
										</ol>
									</div>

									<div>
										<h3 className="text-xl font-medium text-neutral-900 mb-3">Direct Search Process</h3>
										<ol className="border-l border-blue-200 ml-3 space-y-6 pt-2">
											<li className="relative pl-8 pb-2">
												<div className="absolute -left-3 top-0 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">1</div>
												<h4 className="text-lg font-medium text-neutral-800">Simple Query Input</h4>
												<p className="text-sm text-neutral-600 mt-1">You submit your research topic through a streamlined interface, without the need for follow-up questions or refinement.</p>
											</li>
											<li className="relative pl-8 pb-2">
												<div className="absolute -left-3 top-0 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">2</div>
												<h4 className="text-lg font-medium text-neutral-800">Google Search Grounding</h4>
												<p className="text-sm text-neutral-600 mt-1">The system utilizes Google's Search Grounding technology via Gemini 2.0, which accesses real-time information from Google Search directly through the AI model.</p>
											</li>
											<li className="relative pl-8 pb-2">
												<div className="absolute -left-3 top-0 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">3</div>
												<h4 className="text-lg font-medium text-neutral-800">AI-Powered Synthesis</h4>
												<p className="text-sm text-neutral-600 mt-1">Gemini processes the search results, analyzing and synthesizing the information while maintaining source attribution.</p>
											</li>
											<li className="relative pl-8">
												<div className="absolute -left-3 top-0 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-white font-medium text-sm">4</div>
												<h4 className="text-lg font-medium text-neutral-800">Immediate Report Delivery</h4>
												<p className="text-sm text-neutral-600 mt-1">A well-structured report is generated within seconds, complete with proper citations and sources from the web.</p>
											</li>
										</ol>
									</div>
								</div>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Comparison: Research Methods</h2>

								<div className="overflow-x-auto">
									<table className="min-w-full divide-y divide-neutral-200 mt-4">
										<thead>
											<tr>
												<th className="px-4 py-3 bg-neutral-50 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider border-b">Feature</th>
												<th className="px-4 py-3 bg-primary-50 text-left text-xs font-medium text-primary-700 uppercase tracking-wider border-b">Enhanced Deep Research</th>
												<th className="px-4 py-3 bg-blue-50 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-b">Direct Search</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-neutral-200">
											<tr>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">Processing Time</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">5-10 minutes</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">Seconds to 1 minute</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-neutral-50">Research Methods</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-neutral-50">Parallel web crawling + Google Search Grounding</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-neutral-50">Google Search Grounding only</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">Depth of Analysis</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">Comprehensive, thorough, with diverse perspectives</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">Good overview, less detailed</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-neutral-50">User Input Required</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-neutral-50">Initial query + follow-up questions</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-neutral-50">Simple query only</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">Source Diversity</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">High (combines multiple search engines and direct page visits)</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">Medium (limited to Google Search results)</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-neutral-50">Resource Usage</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-neutral-50">High (browser, multiple requests, parallel processing)</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-neutral-50">Low (single API call)</td>
											</tr>
											<tr>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">Best Used For</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">Academic research, complex topics, when thoroughness is critical</td>
												<td className="px-4 py-3 text-sm text-neutral-700 bg-white">Quick fact-finding, news updates, general knowledge</td>
											</tr>
										</tbody>
									</table>
								</div>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Technical Architecture</h2>

								<div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
									<div className="text-center mb-4">
										<h3 className="text-lg font-medium text-neutral-900">Simplified System Architecture</h3>
									</div>

									<div className="flex flex-col items-center">
										<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
											<div className="border border-neutral-200 bg-white rounded-lg p-3 text-center">
												<div className="font-medium text-neutral-800 mb-1">Frontend</div>
												<div className="text-xs text-neutral-600">Hono JSX, Tailwind CSS</div>
											</div>
											<div className="border border-neutral-200 bg-white rounded-lg p-3 text-center">
												<div className="font-medium text-neutral-800 mb-1">API Layer</div>
												<div className="text-xs text-neutral-600">Cloudflare Workers, Workflows</div>
											</div>
											<div className="border border-neutral-200 bg-white rounded-lg p-3 text-center">
												<div className="font-medium text-neutral-800 mb-1">Data Storage</div>
												<div className="text-xs text-neutral-600">Cloudflare D1 (SQL)</div>
											</div>
										</div>

										<div className="my-2">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
											</svg>
										</div>

										<div className="w-full max-w-3xl">
											<div className="border border-green-200 bg-green-50 rounded-lg p-3 text-center mb-4">
												<div className="font-medium text-green-800 mb-1">Enhanced Deep Research Engine</div>
												<div className="text-xs text-green-700">Parallel Processing Architecture</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
													<div className="border border-primary-200 bg-primary-50 rounded-lg p-2 text-center">
														<div className="text-xs font-medium text-primary-800 mb-1">Web Crawling</div>
														<div className="text-xs text-primary-700">DuckDuckGo, Browser Rendering, Web Scraping</div>
													</div>
													<div className="border border-blue-200 bg-blue-50 rounded-lg p-2 text-center">
														<div className="text-xs font-medium text-blue-800 mb-1">Search Grounding</div>
														<div className="text-xs text-blue-700">Google Search API, Gemini 2.0</div>
													</div>
												</div>
											</div>
											<div className="border border-blue-200 bg-blue-50 rounded-lg p-3 text-center">
												<div className="font-medium text-blue-800 mb-1">Direct Search Engine</div>
												<div className="text-xs text-blue-700">Google Search Grounding, Gemini 2.0</div>
											</div>
										</div>
									</div>
								</div>

								<p className="text-sm text-neutral-600 mt-3">
									The architecture is designed to be fully serverless, allowing for superior scalability and reliability. All components run on Cloudflare's edge network, providing global distribution and low-latency responses regardless of user location. The new parallel processing approach maximizes the strengths of both research methods.
								</p>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Benefits of Parallel Research</h2>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									<div className="bg-green-50 border border-green-100 rounded-lg p-4">
										<div className="flex items-center mb-3">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
											</svg>
											<h3 className="text-sm font-medium text-green-800">Comprehensive Results</h3>
										</div>
										<p className="text-xs text-green-700">Combining web crawling with Google Search provides more diverse, comprehensive research with broader perspectives and source variety.</p>
									</div>

									<div className="bg-green-50 border border-green-100 rounded-lg p-4">
										<div className="flex items-center mb-3">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
											</svg>
											<h3 className="text-sm font-medium text-green-800">Source Diversity</h3>
										</div>
										<p className="text-xs text-green-700">Greater variety of sources by leveraging multiple search engines and direct web visits alongside Google Search results.</p>
									</div>

									<div className="bg-green-50 border border-green-100 rounded-lg p-4">
										<div className="flex items-center mb-3">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
											</svg>
											<h3 className="text-sm font-medium text-green-800">Redundancy</h3>
										</div>
										<p className="text-xs text-green-700">If either research method misses important information, the other can fill in the gaps, ensuring more thorough coverage.</p>
									</div>

									<div className="bg-green-50 border border-green-100 rounded-lg p-4">
										<div className="flex items-center mb-3">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
											</svg>
											<h3 className="text-sm font-medium text-green-800">Balanced Perspective</h3>
										</div>
										<p className="text-xs text-green-700">Different search engines may prioritize different sources, giving you a more balanced view of the topic with reduced algorithmic bias.</p>
									</div>

									<div className="bg-green-50 border border-green-100 rounded-lg p-4">
										<div className="flex items-center mb-3">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
											</svg>
											<h3 className="text-sm font-medium text-green-800">Direct Content Access</h3>
										</div>
										<p className="text-xs text-green-700">Web crawling accesses the actual content of pages, not just snippets, allowing for deeper analysis of the original material.</p>
									</div>

									<div className="bg-green-50 border border-green-100 rounded-lg p-4">
										<div className="flex items-center mb-3">
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
											</svg>
											<h3 className="text-sm font-medium text-green-800">Improved Quality</h3>
										</div>
										<p className="text-xs text-green-700">The combined approach leads to higher quality reports with more accurate information, better source attribution, and more nuanced analysis.</p>
									</div>
								</div>
							</section>

							<section className="space-y-4">
								<h2 className="text-2xl font-semibold text-neutral-900 border-b border-neutral-200 pb-2">Usage Recommendations</h2>

								<div className="space-y-4">
									<p>Choosing the right research method depends on your specific needs:</p>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="bg-primary-50 border border-primary-100 rounded-lg p-5">
											<h3 className="text-lg font-medium text-primary-900 mb-3">When to use Enhanced Deep Research</h3>
											<ul className="space-y-2 text-sm text-neutral-700">
												<li className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													Academic or professional research requiring thorough analysis
												</li>
												<li className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													Complex topics with multiple perspectives
												</li>
												<li className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													Situations where you can wait 5-10 minutes for results
												</li>
												<li className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													When source diversity and balanced perspectives are critical
												</li>
												<li className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													Research for papers, theses, or important reports
												</li>
											</ul>
										</div>

										<div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
											<h3 className="text-lg font-medium text-blue-900 mb-3">When to use Direct Search</h3>
											<ul className="space-y-2 text-sm text-neutral-700">
												<li className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													Quick fact-checking or information gathering
												</li>
												<li className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													Current events or breaking news research
												</li>
												<li className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													When you need immediate results
												</li>
												<li className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													General knowledge questions with straightforward answers
												</li>
												<li className="flex">
													<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													Initial exploratory research before a deeper dive
												</li>
											</ul>
										</div>
									</div>
								</div>
							</section>

							<section className="mt-8">
								<div className="bg-neutral-100 rounded-lg p-5 border border-neutral-200">
									<h3 className="text-lg font-medium text-neutral-800 mb-2">Have more questions?</h3>
									<p className="text-neutral-600 mb-4">Our development team is constantly improving saliksik.net with new features and capabilities. If you have questions about how the platform works or want to provide feedback, please reach out to us.</p>
									<a href="https://github.com/llegomark/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
										<div className="flex items-center">
											<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-2">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											<span>Visit Our GitHub Repository</span>
										</div>
									</a>
								</div>
							</section>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export const ValidationErrorDisplay: FC = (props) => {
	return (
		<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
			<div className="flex">
				<div className="flex-shrink-0">
					<svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
					</svg>
				</div>
				<div className="ml-3">
					<h3 className="text-sm font-medium text-red-800">Validation Error</h3>
					<div className="mt-2 text-sm text-red-700">
						<ul className="list-disc pl-5 space-y-1">
							{props.errors.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};