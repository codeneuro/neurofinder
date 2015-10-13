% example MATLAB script for loading neurofinder data
%
% for more info see:
% - http://neurofinder.codeneuro.org
% - https://github.com/codeneuro/neurofinder
%
% requires two packages from the matlab file exchange
%
% - recursive directory listing 
% - http://www.mathworks.com/matlabcentral/fileexchange/32226-recursive-directory-listing-enhanced-rdir
%
% - jsonlab
% - http://www.mathworks.com/matlabcentral/fileexchange/33381-jsonlab--a-toolbox-to-encode-decode-json-files-in-matlab-octave
%

% load the images
conf = loadjson('images/conf.json');
files = rdir('images/*/*.bin');
x = conf.dims(1);
y = conf.dims(2);
n = length(files);
imgs = zeros([x, y, n], 'uint16');
for i = 1:length(files);
	fid = fopen(files(i).name,'r');
	imgs(:,:,i) = reshape(fread(fid, 'uint16'), x, y);
	fclose(fid);
end

% load the sources
sources = loadjson('sources/sources.json');
masks = zeros(x, y);
for i = 1:length(sources);
	coords = sources(i).coordinates;
	masks(sub2ind([x, y], coords(:,1), coords(:,2))) = 1;
end

% show the outputs
figure();
subplot(1,2,1);
imagesc(mean(imgs,3)); colormap('gray'); axis image off;
subplot(1,2,2);
imagesc(masks); colormap('gray'); axis image off;